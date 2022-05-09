const jwt = require("jsonwebtoken");
const adminModel = require("../../models/admin.model");

const auth = {
	loadAdmin: async (req, res) => {
		try {
			console.log(req.adminId);
			const admin = await adminModel.findById(req.adminId).select("-password");
			if (!admin) {
				return res
					.status(400)
					.json({ success: false, message: "Không tìm thấy tên tài khoản" });
			}
			// Tìm thêm các thông báo
			return res
				.status(200)
				.json({ success: true, message: "load admin successfully", admin });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Server error auth controller" });
		}
	},
	login: async (req, res) => {
		const { username, password } = req.body;
		const admin = await adminModel.findOne({ username });
		if (!admin) {
			return res
				.status(400)
				.json({ success: false, message: "Admin not found" });
		}
		if (password !== admin.password) {
			return res
				.status(400)
				.json({ success: false, message: "Password incorrect" });
		}

		// JWT
		console.log({ adminId: admin._id });
		const accessToken = jwt.sign(
			{ adminId: admin._id },
			process.env.ACCESS_TOKEN_SECRET
		);
		return res.status(200).json({
			success: true,
			message: "Login admin success",
			accessToken,
		});
	},
};

module.exports = auth;
