const jwt = require("jsonwebtoken");
const filterData = require("../../utils/filterData");
const userModel = require("../../models/user.model");
const vesoModel = require("../../models/veso.model");
const thongBaoAgentModel = require("../../models/thongBaoAgent.model");
const formatDate = require("../../utils/formatDate");

const agent = {
	registerAgent: async (req, res) => {
		const user = await userModel.findById(req.userId).select("-password");
		// upgrade role = 1 -> agent;
		user = {
			...user,
			...req.body,
			role: 1,
		};
		await user.save();
		return res.status(200).json({
			success: true,
			message: "Bạn đã trở thành đại lý của XS Minh Ngọc",
			user,
		});
	},

	upLotterySeri: async (req, res) => {
		const {
			namSoSau,
			dai: { value: daiId },
			ngay,
			kihieu,
			soluong,
		} = req.body;
		const thuId = new Date(ngay).getDay();
		// TODO verify kihieu
		try {
			const isPostLottery = await vesoModel.find({
				veso: { $regex: ".*" + namSoSau + "$" },
				daiId,
				ngay,
				kihieu,
			});
			if (isPostLottery.length !== 0) {
				return res.status(200).json({
					success: false,
					message: "Vé số đã đăng lên hệ thống. Vui lòng kiểm tra lại",
				});
			}
			for (i = 0; i <= 9; i++) {
				// const veso = `${bonSoDau}${i}${Math.abs(10 + (caySo - i)) % 10}`;
				const veso = `${i}${namSoSau}`;
				const vesoNew = new vesoModel({
					agentId: req.userId,
					veso,
					daiId,
					ngay,
					thuId,
					kihieu,
					soluong: 10,
				});
				console.log(veso);
				await vesoNew.save();
			}
			return res
				.status(200)
				.json({ success: true, message: "Đăng vé số thành công" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: error.message });
		}
	},

	// upLotteryRetail: async (req, res) => {
	// 	const {
	// 		veso,
	// 		dai: { value: daiId },
	// 		ngay,
	// 		kihieu,
	// 		soluong,
	// 	} = req.body;
	// 	const thuId = new Date(ngay).getDay();
	// 	// TODO verify kihieu
	// 	try {
	// 		const isPostLottery = await vesoModel.find({
	// 			veso,
	// 			daiId: dai,
	// 			ngay,
	// 			kihieu,
	// 		});
	// 		if (isPostLottery.leng !== 0) {
	// 			return res.status(200).json({
	// 				success: false,
	// 				message: "Vé số đã đăng lên hệ thống. Vui lòng kiểm tra lại",
	// 			});
	// 		}
	// 		const vesoNew = new vesoModel({
	// 			agentId: req.userId,
	// 			veso,
	// 			daiId,
	// 			ngay,
	// 			thuId,
	// 			kihieu,
	// 			soluong,
	// 		});
	// 		console.log(vesoNew);
	// 		await vesoNew.save();
	// 		return res
	// 			.status(200)
	// 			.json({ success: true, message: "Thêm vé số thành công" });
	// 	} catch (error) {
	// 		console.log(error);
	// 		res.status(500).json({ success: false, message: error.message });
	// 	}
	// },

	getPostedLottery: async (req, res) => {
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
			agentId: req.userId,
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
				.find({ agentId: req.userId, ...condition })
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

	getThongBaoAgent: async (req, res) => {
		const { ngay, status } = req.query;
		const condition = {};
		if (ngay) {
			condition.ngay = ngay;
		}
		const agentId = req.userId;
		let thongbao = await thongBaoAgentModel
			.find({
				agentId,
				...condition,
			})
			.populate("agentId")
			.populate("vesos.vesoId")
			.populate({
				path: "vesos.vesoId",
				populate: {
					path: "daiId",
				},
			});
		if (thongbao.length !== 0) {
			if (status == 1) {
				thongbao[0].vesos = thongbao[0].vesos.filter(
					(item) => item.soVeE !== 0
				);
			}
			const totalVeDaDang = thongbao[0].vesos.reduce(
				(total, veso) => total + veso.vesoId.soluong,
				0
			);
			const totalVeDaBan = thongbao[0].vesos.reduce(
				(total, veso) => total + veso.vesoId.sold,
				0
			);
			const totalVeE = thongbao[0].vesos.reduce(
				(total, veso) => total + veso.soVeE,
				0
			);
			const pagination = {
				totalVeDaDang,
				totalVeDaBan,
				totalVeE,
			};
			return res.status(200).json({
				success: true,
				message: "Lấy thông báo thành công",
				pagination,
				thongbao,
			});
		} else
			return res.status(200).json({
				success: false,
				message: `Chưa có thông báo cho ngày ${formatDate.ymdTdmy(ngay)}`,
			});
	},
};

module.exports = agent;
