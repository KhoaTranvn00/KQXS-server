const thuModel = require("../../models/thu.model");
const ketquaModel = require("../../models/ketqua.model");

const formatDate = require("../../utils/formatDate");

const getKQXS = {
	ngayMN: async (req, res) => {
		// res.send("get ctrl");
		let { ngay } = req.params;
		if (!ngay) {
			ngay = new Date();
		} else ngay = new Date(formatDate.dayMonth(ngay));
		let result = null;
		let ketquas = [];
		try {
			const thu = await thuModel
				.findOne({ _id: ngay.getDay() })
				.populate("dai.mn");
			const dais = thu.dai.mn;

			for (const dai of dais) {
				try {
					const query = {
						dai: dai._id,
						ngay,
					};
					const ketquadai = await ketquaModel.findOne(query).populate("dai");
					if (ketquadai === null)
						return res.status(400).json({
							success: false,
							message: `Đài ${dai.ten} chưa có kết quả`,
						});
					ketquas.push(ketquadai);
				} catch (error) {
					res.status(400).json({
						success: false,
						message: "Lấy KQ thất bại",
						error: error,
					});
				}
			}
			res.status(200).json({
				success: true,
				message: "Lấy KQXS thành công",
				ngay,
				thu: thu.thu,
				ketquas,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				message: "Ngày nhập vào không hợp lệ",
				error: error,
			});
		}
	},

	thuMN: async (req, res) => {
		const { slug } = req.params;
		try {
			const thu = await thuModel.findOne({ slug: slug }).populate("dai.mn");
			const dais = thu.dai.mn;

			let ngay = new Date();
			while (ngay.getDay() !== thu._id) {
				ngay.setDate(ngay.getDate() - 1);
			}

			const kq1 = [];
			const kq2 = [];
			const kq3 = [];
			for (const dai of dais) {
				try {
					let preNgay = new Date();
					preNgay.setDate(ngay.getDate() - 1);
					const query = {
						dai: dai._id,
					};
					console.log(query);
					const ketquadai = await ketquaModel
						.find(query)
						.populate("dai")
						.sort("-ngay")
						.limit(3);
					if (ketquadai === null)
						return res.status(400).json({
							success: false,
							message: `Đài ${dai.ten} chưa có kết quả`,
						});
					kq1.push(ketquadai[0]);
					kq2.push(ketquadai[1]);
					kq3.push(ketquadai[2]);
				} catch (error) {
					res.status(400).json({
						success: false,
						message: "Lấy KQ thất bại",
						error: error,
					});
				}
			}
			const ngay1 = new Date();
			const ngay2 = new Date();
			const kqs = [
				{ ngay: ngay, ketquas: kq1 },
				{ ngay: new Date(ngay1.setDate(ngay.getDate() - 7)), ketquas: kq2 },
				{ ngay: new Date(ngay2.setDate(ngay.getDate() - 14)), ketquas: kq3 },
			];
			res.status(200).json({
				success: true,
				message: "Lấy KQXS thành công",
				ngay,
				thu: thu.thu,
				kqs,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				message: "Thứ nhập vào không hợp lệ",
				error: error,
			});
		}
		res.send("ok");
	},
};

module.exports = getKQXS;
