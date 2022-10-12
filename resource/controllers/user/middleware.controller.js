const jwt = require("jsonwebtoken");
const middleware = {
	verifyToken: (req, res, next) => {
		const authorHeader = req.header("Authorization");
		const token = authorHeader && authorHeader.split(" ")[1];
		if (!token)
			return res
				.status(401)
				.json({ success: false, message: "Access token not found" });

		try {
			const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.userId = decode.userId;
			next();
		} catch (error) {
			return res
				.status(403)
				.json({ success: false, message: "Invalid access token" });
		}
	},
	verifyTokenAdmin: (req, res, next) => {
		const authorHeader = req.header("Authorization");
		const token = authorHeader && authorHeader.split(" ")[1];
		if (!token)
			return res
				.status(401)
				.json({ success: false, message: "Access token not found" });

		try {
			const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.adminId = decode.adminId;
			next();
		} catch (error) {
			return res
				.status(403)
				.json({ success: false, message: "Invalid access token" });
		}
	},
	verifyAgentToken: (req, res, next) => {
		const authorHeader = req.header("Authorization");
		const token = authorHeader && authorHeader.split(" ")[1];
		if (!token)
			return res
				.status(401)
				.json({ success: false, message: "Access token not found" });

		try {
			const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.userId = decode.userId;
			req.role = decode.role;
			if (decode.role == 1) {
				next();
			}
		} catch (error) {
			return res
				.status(403)
				.json({ success: false, message: "Invalid access token" });
		}
	},
};

module.exports = middleware;
