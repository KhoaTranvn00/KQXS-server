const mienModel = require("../../models/mien.model");
const daiModel = require("../../models/dai.model");
const thuModel = require("../../models/thu.model");
const ketquaModel = require("../../models/ketqua.model");
const veMuaModel = require("../../models/vemua.model");
const formatDate = require("../../utils/formatDate");
const thongbaoModel = require("../../models/thongbao.model");
const vesoModel = require("../../models/veso.model");
const dateUtils = require("../../utils/dateUtils");
const vemuaModel = require("../../models/vemua.model");

// return lại giải trung: 0-8 nếu ko trúng return -1
const doXoSo = (veso, ketqua) => {
	let result = -1;
	for (const [giai, kqs] of ketqua.entries()) {
		if (result !== -1) break;
		for (const kq of kqs) {
			if (veso.slice(-kq.length) == kq) {
				result = giai;
				break;
			}
		}
	}
	return result;
};

const index = {
	getLayout: async (req, res) => {
		try {
			const miens = await mienModel.find();
			let result = [];
			for (const mien of miens) {
				const dais = await daiModel.find({ mien: mien._id }).sort("ten");
				result.push({ mien: mien, dais });
			}
			const today = new Date();
			const dsNaySo = [];
			const nayso = await thuModel.findById(today.getDay());
			for (const mien in nayso.dai) {
				if (nayso.dai.hasOwnProperty(mien)) {
					dsNaySo.push(...nayso.dai[mien]);
				}
			}
			res.status(200).json({ success: true, dsDai: result, dsNaySo });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
	},

	doKQ: async (req, res) => {
		const { ngay, dai, veso } = req.body;
		console.log(req.body);
		if (!ngay || !veso) {
			return res.status(400).json({
				success: false,
				message: "Bạn chưa nhập đủ thông tin",
			});
		}
		const { value: daiId, label: daiTen } = dai;
		const ngayQ = new Date(formatDate.ymdTmdy(ngay));
		try {
			const ketqua = await ketquaModel.findOne({ ngay: ngayQ, dai: daiId });
			const kq = doXoSo(veso, ketqua.ketqua);
			let message = "";
			switch (kq) {
				case -1:
					message = `Tiếc quá vé số ${veso} của bạn không trúng KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)} rùi`;
					break;
				case 0:
					message = `Chúc mừng bạn đã trúng giải Đặc biệt KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)}`;
					break;
				default:
					message = `Chúc mừng bạn đã trúng giải ${kq} KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)}`;
					break;
			}
			res.json({ success: true, ketqua: kq !== -1, message });
		} catch (error) {
			console.log(error);
			res
				.status(400)
				.json({ success: false, message: "Kết quả không tìm tháy" });
		}
	},

	muaVeSo: async (req, res) => {
		const { vemuas } = req.body;
		vemuas.forEach(async (vemuaBody, index) => {
			// console.log(vemuaBody);

			// update soluong veso
			const veso = await vesoModel.findById(vemuaBody._id);
			if (veso.soluong >= vemuaBody.soVeMua) {
				veso.sold += vemuaBody.soVeMua;
				await veso.save();

				const vemuaNew = new vemuaModel({
					userId: req.userId,
					vesoId: vemuaBody._id,
					soluong: vemuaBody.soVeMua,
				});
				await vemuaNew.save();
			} else {
				return res.status(400).json({
					success: false,
					message: "Vé số còn lại không đủ số lượng mua",
				});
			}
		});
		res.status(200).json({
			success: true,
			message: "Mua vé số thành công, Chúc bạn may mắn",
		});
	},

	veDaMua: async (req, res) => {
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
			const veDaMuas = await veMuaModel
				.find({ userId: req.userId, ...filter })
				.populate("daiId");
			if (veDaMuas) {
				res.status(200).json({ success: true, veDaMuas });
			}
		} catch (error) {
			console.log(error);
			res
				.status(400)
				.json({ success: false, message: "Lay ve da mua ko thanh cong" });
		}
	},

	// thongBao: async (req, res) => {
	// 	try {
	// 		const thongbaos = await thongbaoModel
	// 			.find({ userId: req.userId })
	// 			.populate("veMuaId")
	// 			.populate({
	// 				path: "veMuaId",
	// 				populate: { path: "daiId" },
	// 			})
	// 			.sort({ createdAt: -1 });
	// 		if (thongbaos) {
	// 			res.status(200).json({ success: true, thongbaos });
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		res
	// 			.status(400)
	// 			.json({ success: false, message: "lay thong bao khong thanh cong" });
	// 	}
	// },

	getVeSoDeMua: async (req, res) => {
		let { page, daiId, veso, ngay, createdAt, tg, status } = req.query;
		const itemsPerPage = 30;

		if (!page) {
			page = 1;
		}
		const condition = {};
		// condition.soluong = {
		// 	$gt: "$sold",
		// };
		if (dateUtils.verifyToday()) {
			condition.ngay = { $gte: dateUtils.getToday() };
		} else {
			condition.ngay = { $gte: dateUtils.getTomorrow() };
		}

		if (status) {
			condition.status = status;
		}
		if (daiId) {
			condition.daiId = daiId;
		}
		if (veso) {
			condition.veso = { $regex: ".*" + veso + "$" };
			// condition.veso = veso;
		}
		if (ngay) {
			condition.ngay = ngay;
		}
		if (createdAt) {
			condition.createdAt = createdAt;
		}

		const totalItem = await vesoModel
			.find({ ...condition, $expr: { $gt: ["$soluong", "$sold"] } })
			.count();
		const totalPage = Math.ceil(totalItem / itemsPerPage);

		if (page > totalPage) {
			return res
				.status(200)
				.json({ success: false, message: "Trang không có kết quả" });
		} else {
			const pagination = {
				currentPage: page,
				itemsPerPage,
				totalItem,
				totalPage,
			};
			const vesos = await vesoModel
				.find({ ...condition, $expr: { $gt: ["$soluong", "$sold"] } })
				// .$where("this.sold > this.soluong")
				.sort({ ngay: "asc" })
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

	getVeSoDaMua: async (req, res) => {
		let { page, daiId, veso, ngay, createdAt, tg, status } = req.query;
		const itemsPerPage = 30;

		if (!page) {
			page = 1;
		}
		const condition = {};

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

		const preQuery = await vesoModel.find({ ...condition });

		const listId = preQuery.map((veso) => veso.id);

		const totalItem = await veMuaModel
			.find({ userId: req.userId, vesoId: { $in: listId } })
			.count();
		const totalPage = Math.ceil(totalItem / itemsPerPage);

		if (page > totalPage) {
			return res
				.status(200)
				.json({ success: false, message: "Trang không có kết quả" });
		} else {
			const pagination = {
				currentPage: page,
				itemsPerPage,
				totalItem,
				totalPage,
			};
			const vesos = await veMuaModel
				.find({ userId: req.userId, vesoId: { $in: listId } })
				.populate({
					path: "vesoId",
					options: { sort: { ngay: -1 } },
				})
				// .sort({ ngay: "asc" })
				.skip((page - 1) * itemsPerPage)
				.limit(itemsPerPage)
				.populate({
					path: "vesoId",
					populate: {
						path: "daiId",
					},
				})
				.populate({
					path: "vesoId",
					populate: {
						path: "thuId",
					},
				});

			return res.status(200).json({
				success: true,
				message: "Lấy vé số đã đăng thành công",
				vesos,
				pagination,
			});
		}
	},

	getThongBao: async (req, res) => {
		let { page, daiId, veso, ngay, createdAt, tg, status } = req.query;
		const itemsPerPage = 30;

		if (!page) {
			page = 1;
		}
		const condition = {};

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

		const preQuery = await vesoModel.find({ ...condition });

		const listId = preQuery.map((veso) => veso.id);

		const totalItem = await thongbaoModel
			.find({ uesrId: req.userId, role: 1 })
			.count();
		const totalPage = Math.ceil(totalItem / itemsPerPage);

		if (page > totalPage) {
			return res
				.status(200)
				.json({ success: false, message: "Trang không có kết quả" });
		} else {
			const pagination = {
				currentPage: page,
				itemsPerPage,
				totalItem,
				totalPage,
			};
			const thongbaos = await thongbaoModel
				.find({ userId: req.userId, role: 1 })
				.sort({ createdAt: "desc" })
				.skip((page - 1) * itemsPerPage)
				.limit(itemsPerPage)
				.populate({
					path: "vesoId",
					populate: {
						path: "daiId",
					},
				})
				.populate({
					path: "vesoId",
					populate: {
						path: "thuId",
					},
				});

			return res.status(200).json({
				success: true,
				message: "Lấy vé số đã đăng thành công",
				vesos: thongbaos,
				pagination,
			});
		}
	},
};

module.exports = index;
