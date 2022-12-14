const filterData = require("../../utils/filterData");
const veMuaModel = require("../../models/vemua.model");
const vesoModel = require("../../models/veso.model");
const thongBaoAgentModel = require("../../models/thongBaoAgent.model");
const formatDate = require("../../utils/formatDate");

const admin = {
	getVeMua2: async (req, res) => {
		const params = req.query;
		const { tg, status } = params;
		let filter = {};
		if (status) {
			filter = { status };
		}
		if (tg) {
			let ngay;
			switch (tg) {
				case "today":
					ngay = new Date();
					ngay.setHours(0, 0, 0, 0);

					break;
				case "3dago":
					ngay = new Date();
					ngay.setDate(ngay.getDate() - 3);
					ngay.setHours(0, 0, 0, 0);
					break;

				case "month":
					ngay = new Date();
					ngay.setMonth(ngay.getMonth() - 1);
					ngay.setHours(0, 0, 0, 0);
					break;
				default:
					break;
			}
			filter = { ...filter, ngay: { $gte: ngay } };
		}
		console.log(filter);
		try {
			const veMuas = await veMuaModel
				.find(filter)
				.populate("userId")
				.populate("daiId");
			if (veMuas) {
				const tongSoVe = veMuas.reduce((tongSoVe, veMua) => {
					return (tongSoVe += veMua.soluong);
				}, 0);
				res.status(200).json({ success: true, tongSoVe, veMuas });
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: "Lấy vé mua thất bại" });
		}
	},

	getVeMua: async (req, res) => {
		let { page, daiId, veso, ngay, createdAt, tg, status } = req.query;
		const itemsPerPage = 30;

		if (!page) {
			page = 1;
		}
		const condition = {};
		if (tg) {
			condition.ngay = filterData.getFilterTG(tg);
		}
		if (status) {
			condition.status = status;
		}
		if (daiId) {
			condition.daiId = daiId;
		}
		if (veso) {
			condition.veso = veso;
		}
		if (ngay) {
			condition.ngay = ngay;
		}
		if (createdAt) {
			condition.createdAt = createdAt;
		}

		const totalItems = await vesoModel.find({
			...condition,
		});
		const totalItem = totalItems.length;
		const totalPage = Math.ceil(totalItem / itemsPerPage);

		if (page > totalPage) {
			return res
				.status(200)
				.json({ success: false, message: "Trang không có kết quả" });
		} else {
			const totalVeDaDang = totalItems.reduce(
				(total, veso) => total + veso.soluong,
				0
			);
			const totalVeDaBan = totalItems.reduce(
				(total, veso) => total + veso.sold,
				0
			);
			const pagination = {
				currentPage: page,
				itemsPerPage,
				totalItem,
				totalPage,
				totalVeDaDang,
				totalVeDaBan,
			};
			const vesos = await vesoModel
				.find({ ...condition })
				.sort({ ngay: "desc" })
				.skip((page - 1) * itemsPerPage)
				.limit(itemsPerPage)
				.populate("daiId")
				.populate("thuId");
			return res.status(200).json({
				success: true,
				message: "Lấy vé số đã đăng thành công",
				vesos,
				pagination,
			});
		}
	},

	getBaoCao: async (req, res) => {
		const vesos = await vesoModel.aggregate([
			{
				$group: {
					_id: {
						year: { $year: "$ngay" },
						month: { $month: "$ngay" },
					},
					count: { $sum: 1 },
					totalQuality: { $sum: "$soluong" },
					totalSold: { $sum: "$sold" },
				},
			},
			{
				$sort: {
					"_id.year": -1,
					"_id.month": -1,
				},
			},
		]);

		const groupStatus = await vesoModel.aggregate([
			{
				$group: {
					_id: {
						year: { $year: "$ngay" },
						month: { $month: "$ngay" },
						status: "$status",
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					"_id.year": -1,
					"_id.month": -1,
				},
			},
		]);
		const totalQuality = vesos.map((item) => ({
			x: `Tháng ${item._id.month}`,
			y: item.totalQuality,
		}));

		const totalSold = vesos.map((item) => ({
			x: `Tháng ${item._id.month}`,
			y: item.totalSold,
		}));

		const count = vesos.map((item) => ({
			x: `Tháng ${item._id.month}`,
			y: item.count,
		}));

		const trung = groupStatus
			.filter((item) => item._id.status == 2)
			.map((item2) => ({
				x: `Tháng ${item2._id.month}`,
				y: item2.count,
			}));
		const kotrung = groupStatus
			.filter((item) => item._id.status == 1)
			.map((item2) => ({
				x: `Tháng ${item2._id.month}`,
				y: item2.count,
			}));
		const chuacokq = groupStatus
			.filter((item) => item._id.status == 0)
			.map((item2) => ({
				x: `Tháng ${item2._id.month}`,
				y: item2.count,
			}));
		console.log("groupStatus", groupStatus);
		console.log("trung", trung);
		console.log("kotrung", kotrung);
		console.log("chuacokq", chuacokq);

		const response = {
			success: true,
			totalQuality,
			totalSold,
			count,
			trung,
			kotrung,
			chuacokq,
		};
		// console.log("vesos:", totalQuality);
		return res.status(200).json(response);
	},

	genThongBaoAgent: async (req, res) => {
		const { ngay } = req.body;
		const ngayDate = new Date(ngay);
		const isUp = await thongBaoAgentModel.find({ ngay: ngayDate });
		if (isUp.length !== 0) {
			return res.status(200).json({
				success: false,
				message: `Đã thống kê vé số còn tồn cho ngày ${formatDate.ymdTdmy(
					ngay
				)}`,
			});
		}
		const vesos = await vesoModel.find({ ngay: ngayDate });
		let veEObject = {};
		vesos.forEach((veso) => {
			if (veEObject.hasOwnProperty(veso.agentId)) {
				veEObject[veso.agentId].push({
					vesoId: veso._id,
					soVeE: veso.soluong - veso.sold,
				});
			} else {
				veEObject[veso.agentId] = [
					{
						vesoId: veso._id,
						soVeE: veso.soluong - veso.sold,
					},
				];
			}
		});
		for (const veE in veEObject) {
			veENew = await thongBaoAgentModel.create({
				agentId: veE,
				ngay: ngayDate,
				vesos: veEObject[veE],
			});
			// console.log({
			// 	agentId: veE,
			// 	ngay: ngayDate,
			// 	vesos: veEObject[veE],
			// });
		}
		// console.log(veEObject);
		return res.status(200).json({
			success: true,
			message: `Thống kê vé số còn tồn cho ngày ${formatDate.ymdTdmy(
				ngay
			)} thành công`,
			veEObject,
		});
	},
};

module.exports = admin;
