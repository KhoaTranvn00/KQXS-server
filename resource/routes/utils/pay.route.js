const route = require("express").Router();
const paypal = require("paypal-rest-sdk");

paypal.configure({
	mode: "sandbox", //sandbox or live
	client_id:
		"Aavx0u0Yei7nJJATWC3vDobqw2wm27NNJ-ps7p5dp1rDsLi9UcdgUboZC0qcSFnXNNw_Nq0em2iTxGnl",
	client_secret:
		"EKU3y5zLmy8aGgFZvC2b37QjqUGzYrwF7hB8c2zdGvW0gNazJ-cBO-v-EebijO6a-YvMcB9Y2FcMYvzn",
});

var items = [
	{
		name: "Red Sox Hat",
		sku: "001",
		price: "1.0",
		currency: "USD",
		quantity: 15,
	},
	{
		name: "Blue Sox Hat",
		sku: "002",
		price: "1.5",
		currency: "USD",
		quantity: 1,
	},
	{
		name: "Blue Sox Hat",
		sku: "003",
		price: "1.5",
		currency: "USD",
		quantity: 1,
	},
	{
		name: "Blue Sox Hat",
		sku: "004",
		price: "1.5",
		currency: "USD",
		quantity: 1,
	},
];

var total = 0;
for (i = 0; i < items.length; i++) {
	total += parseFloat(items[i].price) * items[i].quantity;
}

route.get("/123", function (req, res) {
	return res.json({ sucess: true });
});

route.post("/pay", function (req, res) {
	const create_payment_json = {
		intent: "sale",
		payer: {
			payment_method: "paypal",
		},
		redirect_urls: {
			return_url: "http://localhost:4000/api/pay/success",
			cancel_url: "http://localhost:4000/api/pay/cancel",
		},
		transactions: [
			{
				item_list: {
					items: items,
				},
				amount: {
					currency: "USD",
					total: total.toString(),
				},
				description: "Hat for the best team ever",
			},
		],
	};

	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			res.render("cancle");
		} else {
			console.log(payment);
			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === "approval_url") {
					res.redirect(payment.links[i].href);
				}
			}
		}
	});
});
route.get("/cancel", function (req, res) {
	res.redirect("http://localhost:3000/account/mua-ve-so?success=false");
});
route.get("/success", (req, res) => {
	console.log(1);
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;

	const execute_payment_json = {
		payer_id: payerId,
		transactions: [
			{
				amount: {
					currency: "USD",
					total: total.toString(),
				},
			},
		],
	};
	console.log(1);
	paypal.payment.execute(
		paymentId,
		execute_payment_json,
		function (error, payment) {
			if (error) {
				res.redirect("http://localhost:3000/account/mua-ve-so?success=false");
			} else {
				console.log(JSON.stringify(payment));
				res.redirect("http://localhost:3000/account/mua-ve-so?success=true");
			}
		}
	);
});

module.exports = route;
