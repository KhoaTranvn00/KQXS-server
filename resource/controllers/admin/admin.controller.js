const filterData = require("../../utils/filterData");
const veMuaModel = require("../../models/vemua.model");
const vesoModel = require("../../models/veso.model");

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
};

module.exports = admin;
