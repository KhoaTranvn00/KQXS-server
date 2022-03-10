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
};

module.exports = getKQXS;
