const ketquaModel = require("../../models/ketqua.model");
const crawlDataMB = require("../../utils/crawlDataMB");
const crawlDataMN = require("../../utils/crawlDataMN");
const crawlDataMT = require("../../utils/crawlDataMT");
const daiTheoNgay = require("../../utils/daiTheoNgay");
const veMuaModel = require("../../models/vemua.model");
const vesoModel = require("../../models/veso.model");
const thongBaoModel = require("../../models/thongbao.model");
const formatterDate = require("../../utils/formatDate");
const formatDate = require("../../utils/formatDate");

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
			if (kq.length == 6 && veso.slice(-5) === kq.slice(-5)) {
				result = 9;
				break;
			}
		}
	}
	return result;
};

const setKQXS = {
	setMN: async (req, res) => {
		const { ngay } = req.params;
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mn");
		let result = [];
		for (const dai of dais) {
			try {
				const ketquamoi = await crawlDataMN(dai, ngay);
				result.push(ketquamoi);

				const preQuery = await vesoModel.find({
					daiId: dai._id,
					ngay: new Date(formatDate.dayMonthZ(ngay)),
				});

				const listId = preQuery.map((veso) => veso.id);

				const veMuas = await veMuaModel
					.find({
						vesoId: { $in: listId },
					})
					.populate({
						path: "vesoId",
						populate: {
							path: "daiId",
						},
					});
				for (const veso of preQuery) {
					const trungGiai = doXoSo(veso.veso, ketquamoi.ketqua);
					console.log(trungGiai);
					// trungGiai return lại giải trung: 0-8 nếu ko trúng return -1
					if (trungGiai === -1) {
						const updateVeMua = await vesoModel.findByIdAndUpdate(
							veso._id,
							{ status: 1 },
							{ new: true }
						);
					} else {
						const updateVeMua = await vesoModel.findByIdAndUpdate(
							veso._id,
							{ status: 2 },
							{ new: true }
						);
					}
				}
				for (const veMua of veMuas) {
					const trungGiai = doXoSo(veMua.vesoId.veso, ketquamoi.ketqua);
					console.log(trungGiai);
					// trungGiai return lại giải trung: 0-8 nếu ko trúng return -1
					if (trungGiai === -1) {
						try {
							// Create thong bao only user
							const thongBao = await thongBaoModel.create({
								message: `Tiếc quá, vế số ${veMua.vesoId.veso}. Đài ${veMua.vesoId.daiId.ten} ngay ${ngay} KHÔNG TRÚNG GIẢI`,
								status: false,
								role: 1,
								vesoId: veMua.vesoId._id,
								userId: veMua.userId,
							});
						} catch (error) {
							console.log(error);
							res.status(400).json({
								success: false,
								message: "Update thong bao sau them ket qua that bai",
							});
						}
					} else {
						try {
							const thongBao = await thongBaoModel.create({
								message: `Chúc mừng, vế số ${veMua.vesoId.veso}. Đài ${
									veMua.vesoId.daiId.ten
								} ngay ${ngay} TRÚNG GIẢI ${
									trungGiai === 0
										? "ĐẶC BIỆT"
										: trungGiai === 9
										? "KHUYẾN KHÍCH"
										: trungGiai
								}`,
								status: false,
								role: 1,
								vesoId: veMua.vesoId._id,
								userId: veMua.userId,
							});
						} catch (error) {
							console.log(error);
							res.status(400).json({
								success: false,
								message: "Update ve mua sau them ket qua that bai",
							});
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
		try {
			const ketquamoi = await ketquaModel.create(result);
			if (ketquamoi) {
				return res.status(200).json({
					success: true,
					message: "Thêm KQXS thành công",
					KQXS: ketquamoi,
				});
			}
			return res.status(200);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: "Thêm KQXS thất bại",
				error: error.message,
			});
		}
	},

	setMT: async (req, res) => {
		const { ngay } = req.params;
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mt");
		let result = [];
		for (const dai of dais) {
			const ketquamoi = await crawlDataMT(dai, ngay);
			result.push(ketquamoi);
		}
		try {
			const ketquamoi = await ketquaModel.create(result);
			if (ketquamoi) {
				return res.status(200).json({
					success: true,
					message: "Thêm KQXS thành công",
					KQXS: ketquamoi,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: "Thêm KQXS thất bại",
				error: error.message,
			});
		}
	},

	setMB: async (req, res) => {
		const { ngay } = req.params;
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mb");
		let result = [];
		for (const dai of dais) {
			const ketquamoi = await crawlDataMB(dai, ngay);
			result.push(ketquamoi);
		}
		try {
			const ketquamoi = await ketquaModel.create(result);
			if (ketquamoi) {
				return res.status(200).json({
					success: true,
					message: "Thêm KQXS thành công",
					KQXS: ketquamoi,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: "Thêm KQXS thất bại",
			});
		}
	},
};

module.exports = setKQXS;
