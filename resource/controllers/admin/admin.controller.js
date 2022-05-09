const veMuaModel = require("../../models/vemua.model");

const admin = {
	getVeMua: async (req, res) => {
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
};

module.exports = admin;
