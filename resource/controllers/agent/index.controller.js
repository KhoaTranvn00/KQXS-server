const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");
const vesoModel = require("../../models/veso.model");

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

	upLottery: async (req, res) => {
		const { bonSoDau, caySo, daiId, ngay, thuId, kihieu, soluong } = req.body;
		try {
			for (i = 0; i <= 9; i++) {
				const veso = `${bonSoDau}${i}${Math.abs(10 + (caySo - i)) % 10}`;
				const vesoNew = new vesoModel({
					agentId: req.userId,
					veso,
					daiId,
					ngay,
					thuId,
					kihieu,
					soluong,
				});
				console.log(veso);
				// await vesoNew.save();
			}
			return res
				.status(200)
				.json({ success: true, message: "Thêm vé số thành công" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: error.message });
		}
	},
};

module.exports = agent;
