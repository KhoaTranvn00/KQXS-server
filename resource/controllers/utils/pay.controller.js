const formatDate = require("../../utils/formatDate");
const paypal = require("paypal-rest-sdk");

paypal.configure({
	mode: "sandbox", //sandbox or live
	client_id:
		"AXMeJ1HaMiTJqoZAXDezOC_NQtXZjYGH55WmJVTvqtrZgkva2xN1NkPQzR8eFyrUWR6TiK9y3YzWLpws",
	client_secret:
		"EDtLfGhK53kOEEbVhTb0kzwcLCwfmRBsgYzTvJ9q3HZ9SgWXL6fGlMWs33hCbKe7RQENxXkGpabYDmok",
});

const utils = {};

module.exports = utils;
