const route = require("express").Router();
const payModel = require("../../models/pay.model");

route.get("/", function (req, res) {
	return res.json({ success: true });
});

route.post("/create_payment_url", function (req, res, next) {
	var ipAddr =
		req.headers["x-forwarded-for"] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

	var config = require("config");
	var dateFormat = require("dateformat");
	var date = new Date();
	date.setMinutes(10);

	var orderDescription =
		"Thanh toan don hang: Mua KQXS Minh Ngoc: " +
		dateFormat(date, "yyyy-mm-dd HH:mm:ss");
	console.log(orderDescription);
	var tmnCode = config.get("vnp_TmnCode");
	var secretKey = config.get("vnp_HashSecret");
	var vnpUrl = config.get("vnp_Url");
	var returnUrl = config.get("vnp_ReturnUrl");

	var createDate = dateFormat(date, "yyyymmddHHmmss");
	var orderId = dateFormat(date, "HHmmss");
	console.log("body", req.body);
	var amount = req.body.amount;
	var bankCode = req.body.bankCode;

	var orderInfo = orderDescription;
	var orderType = req.body.orderType;
	var locale = req.body.language;
	if (locale === null || locale === "") {
		locale = "vn";
	}
	var currCode = "VND";
	var vnp_Params = {};
	vnp_Params["vnp_Version"] = "2.1.0";
	vnp_Params["vnp_Command"] = "pay";
	vnp_Params["vnp_TmnCode"] = tmnCode;
	// vnp_Params["vnp_Merchant"] = "";
	vnp_Params["vnp_Locale"] = locale;
	vnp_Params["vnp_CurrCode"] = currCode;
	vnp_Params["vnp_TxnRef"] = orderId;
	vnp_Params["vnp_OrderInfo"] = orderInfo;
	vnp_Params["vnp_OrderType"] = orderType;
	vnp_Params["vnp_Amount"] = amount * 100;
	vnp_Params["vnp_ReturnUrl"] = returnUrl;
	vnp_Params["vnp_IpAddr"] = ipAddr;
	vnp_Params["vnp_CreateDate"] = createDate;
	if (bankCode !== null && bankCode !== "") {
		vnp_Params["vnp_BankCode"] = bankCode;
	}

	vnp_Params = sortObject(vnp_Params);

	var querystring = require("qs");
	var signData = querystring.stringify(vnp_Params, { encode: false });
	var crypto = require("crypto");
	var hmac = crypto.createHmac("sha512", secretKey);
	var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
	vnp_Params["vnp_SecureHash"] = signed;
	vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

	// res.redirect(vnpUrl);
	return res.json({ url: vnpUrl });
});

route.get("/vnpay_return", async function (req, res, next) {
	var vnp_Params = req.query;

	var secureHash = vnp_Params["vnp_SecureHash"];

	const pay = await payModel.findById(secureHash);

	if (pay) {
		return res.json({ status: "error", message: "Mã hóa đơn đã được sử dụng" });
	} else {
		const newPay = await payModel.create({ _id: secureHash });
	}

	delete vnp_Params["vnp_SecureHash"];
	delete vnp_Params["vnp_SecureHashType"];

	vnp_Params = sortObject(vnp_Params);

	var config = require("config");
	var tmnCode = config.get("vnp_TmnCode");
	var secretKey = config.get("vnp_HashSecret");

	var querystring = require("qs");
	var signData = querystring.stringify(vnp_Params, { encode: false });
	var crypto = require("crypto");
	var hmac = crypto.createHmac("sha512", secretKey);
	var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

	if (secureHash === signed) {
		//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
		return res.json({ status: "success", message: "Thanh toán thành công" });
		// res.render('success', {code: vnp_Params['vnp_ResponseCode']})
	} else {
		return res.json({ status: "error", message: "Mã thanh toán không hợp lệ" });
	}
});

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
	}
	return sorted;
}

module.exports = route;
