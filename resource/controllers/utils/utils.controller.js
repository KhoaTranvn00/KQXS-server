const formatDate = require("../../utils/formatDate");
const thuModel = require("../../models/thu.model");
const daiModel = require("../../models/dai.model");

const utils = {
	getDaiTheoNgay: async (req, res) => {
		const { ngay } = req.params;
		const ngayThu = new Date(formatDate.dayMonth(ngay));
		const thuQ = ngayThu.getDay();
		try {
			const thu = await thuModel
				.findById(thuQ)
				.populate("dai.mn")
				.populate("dai.mt")
				.populate("dai.mb");
			let daiOption = [];
			thu.dai.mn.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			thu.dai.mt.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			thu.dai.mb.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			res.status(200).json({ success: true, daiOption });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
		// res.send(ngay);
	},
	getDaiTheoNgayMien: async (req, res) => {
		const { ngay, mien } = req.params;
		const ngayThu = new Date(formatDate.dayMonth(ngay));
		const thuQ = ngayThu.getDay();
		try {
			const thu = await thuModel
				.findById(thuQ)
				.populate("dai.mn")
				.populate("dai.mt")
				.populate("dai.mb");
			let daiOption = [];
			thu.dai.mn.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			thu.dai.mt.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			thu.dai.mb.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			res.status(200).json({ success: true, daiOption });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
		res.send(ngay);
	},

	getDaiMienNamTheoNgay: async (req, res) => {
		const { ngay } = req.params;
		const ngayThu = new Date(formatDate.dayMonth(ngay));
		const thuQ = ngayThu.getDay();
		const populate = `dai.mn`;
		try {
			const thu = await thuModel.findById(thuQ).populate(populate);
			let daiOption = [
				{
					label: "chon ngay",
					value: null,
				},
			];
			thu.dai.mn.forEach((dai) => {
				daiOption.push({ value: dai._id, label: dai.ten });
			});
			res.status(200).json({ success: true, daiOption });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
		// res.send(ngay);
	},

	getFullDaiMienNam: async (req, res) => {
		const dais = await daiModel.find({ mien: "mn" });
		const daiOption = [
			{
				label: "Chọn đài",
				value: null,
			},
		];
		dais.forEach((dai) => {
			daiOption.push({ value: dai._id, label: dai.ten });
		});
		res.status(200).json({ success: true, daiOption });
	},
};

module.exports = utils;
