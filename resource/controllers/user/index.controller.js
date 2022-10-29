const mienModel = require("../../models/mien.model");
const daiModel = require("../../models/dai.model");
const thuModel = require("../../models/thu.model");
const ketquaModel = require("../../models/ketqua.model");
const veMuaModel = require("../../models/vemua.model");
const formatDate = require("../../utils/formatDate");
const thongbaoModel = require("../../models/thongbao.model");
const vesoModel = require("../../models/veso.model");
const dateUtils = require("../../utils/dateUtils");

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
		const { ngay, dai, veso, soLuong } = req.body;
		console.log({ ngay: new Date(formatDate.ymdTmdy(ngay)) });
		console.log(req.body);
		const { value: daiId, label: daiTen } = dai;
		const ngayQ = new Date(formatDate.ymdTmdy(ngay));
		try {
			const veMua = await veMuaModel.create({
				...req.body,
				ngay: new Date(formatDate.ymdTmdy(ngay)),
				daiId,
				userId: req.userId,
			});
			if (veMua) {
				res.status(200).json({
					success: true,
					message: "Mua vé số thành công, Chúc bạn may mắn",
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: "Mua vé số thất bại" });
		}
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

	thongBao: async (req, res) => {
		try {
			const thongbaos = await thongbaoModel
				.find({ userId: req.userId })
				.populate("veMuaId")
				.populate({
					path: "veMuaId",
					populate: { path: "daiId" },
				})
				.sort({ createdAt: -1 });
			if (thongbaos) {
				res.status(200).json({ success: true, thongbaos });
			}
		} catch (error) {
			console.log(error);
			res
				.status(400)
				.json({ success: false, message: "lay thong bao khong thanh cong" });
		}
	},

	getVeSoDeMua: async (req, res) => {
		let { page, daiId, veso, ngay, createdAt, tg, status } = req.query;
		const itemsPerPage = 30;

		if (!page) {
			page = 1;
		}
		const condition = {};
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
			condition.veso = veso;
		}
		if (ngay) {
			condition.ngay = ngay;
		}
		if (createdAt) {
			condition.createdAt = createdAt;
		}

		const totalItem = await vesoModel.find({ ...condition }).count();
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

module.exports = index;
