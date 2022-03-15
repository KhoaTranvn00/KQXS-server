const ketquaModel = require("../../models/ketqua.model");
const crawlDataMB = require("../../utils/crawlDataMB");
const crawlDataMN = require("../../utils/crawlDataMN");
const crawlDataMT = require("../../utils/crawlDataMT");
const daiTheoNgay = require("../../utils/daiTheoNgay");
const formatterDate = require("../../utils/formatDate");

const setKQXS = {
	setMN: async (req, res) => {
		const { ngay } = req.params;
		console.log(ngay);
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mn");
		console.log(dais);
		let result = [];
		for (const dai of dais) {
			const ketquamoi = await crawlDataMN(dai.slug, ngay);
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

	setMT: async (req, res) => {
		const { ngay } = req.params;
		console.log(ngay);
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mt");
		console.log(dais);
		let result = [];
		for (const dai of dais) {
			const ketquamoi = await crawlDataMT(dai.slug, ngay);
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

	setMB: async (req, res) => {
		const { ngay } = req.params;
		console.log(ngay);
		const dais = await daiTheoNgay(formatterDate.dayMonth(ngay), "mb");
		console.log(dais);
		let result = [];
		for (const dai of dais) {
			const ketquamoi = await crawlDataMB(dai.slug, ngay);
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
