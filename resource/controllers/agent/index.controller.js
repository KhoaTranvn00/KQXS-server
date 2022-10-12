const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");

const auth = {
	registerAgent: async (req, res) => {
		const user = await userModel.findById(req.userId).select("-password");
		// upgrade role = 1 - agent;
		user.role = 1;
		await user.save();
		return res.status(200).json({
			success: true,
			message: "Bạn đã trở thành đại lý của XS Minh Ngọc",
			user,
		});
	},
};
