const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");

const auth = {
	loadUser: async (req, res) => {
		try {
			const user = await userModel.findById(req.userId).select("-password");
			if (!user) {
				return res
					.status(400)
					.json({ success: false, message: "Không tìm thấy tên tài khoản" });
			}
			// Tìm thêm các thông báo
			return res
				.status(200)
				.json({ success: true, message: "load user successfully", user });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Server error auth controller" });
		}
	},
	register: async (req, res) => {
		const { username, password } = req.body;
		try {
			const user = await userModel.findOne({ username });
			if (user) {
				return res
					.status(400)
					.json({ success: false, message: "Tên tài khoản đã tồn tại" });
			}
			const newUser = new userModel({ username, password });
			await newUser.save();

			// JWT
			const accessToken = jwt.sign(
				{ userId: newUser._id },
				process.env.ACCESS_TOKEN_SECRET
			);
			return res.status(200).json({
				success: true,
				message: "Đăng kí thành công",
				accessToken,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: error.message });
		}
	},
	login: async (req, res) => {
		const { username, password } = req.body;
		const user = await userModel.findOne({ username });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Không tìm thấy tên tài khoản" });
		}
		if (password !== user.password) {
			return res
				.status(400)
				.json({ success: false, message: "Mật khẩu không chính xác" });
		}

		// JWT
		const accessToken = jwt.sign(
			{ userId: user._id },
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
