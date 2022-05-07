const jwt = require("jsonwebtoken");
const adminModel = require("../../models/user.model");

const auth = {
	login: async (req, res) => {
		const { username, password } = req.body;
		const admin = await adminModel.findOne({ username });
		if (!admin) {
			return res
				.status(400)
				.json({ success: false, message: "Admin not found" });
		}
		if (password !== user.password) {
			return res
				.status(400)
				.json({ success: false, message: "Password incorrect" });
		}

		// JWT
		const accessToken = jwt.sign(
			{ AdminId: admin._id },
			process.env.ACCESS_TOKEN_SECRET
		);
		return res.status(200).json({
			success: true,
			message: "Login success",
			accessToken,
		});
	},
};

module.exports = auth;
