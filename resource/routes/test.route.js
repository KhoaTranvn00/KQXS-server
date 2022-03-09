const express = require("express");
const route = express.Router();

const request = require("request");
const cheerio = require("cheerio");

const dais = require("../models/dai.model");
const ketquas = require("../models/ketqua.model");
const crawlData = require("../utils/crawlData");
const DaiTheoNgay = require("../utils/DaiTheoNgay");

route.get("/", async (req, res) => {
	// request.get(
	// 	"https://www.minhngoc.com.vn/getkqxs/bac-lieu/15-02-2022.js",
	// 	async (err, response, body) => {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			// console.log(body);
	// 			const $ = cheerio.load(body);
	// 			const dai = $(body).find("div.title").text().trim().slice(5, -11);
	// 			const daiId = await dais.findOne({ ten: dai });
	// 			const ngaytho = $(body)
	// 				.find("div.title")
	// 				.text()
	// 				.trim()
	// 				.slice(-10)
	// 				.split("/");
	// 			const ngay = new Date(ngaytho[2], ngaytho[1] - 1, ngaytho[0]);
	// 			const loaive = $(body).find("td.ngay").text().trim().slice(9);
	// 			const giaidb = $(body).find("td.giaidb").text().trim().split(" - ");
	// 			const giai1 = $(body).find("td.giai1").text().trim().split(" - ");
	// 			const giai2 = $(body).find("td.giai2").text().trim().split(" - ");
	// 			const giai3 = $(body).find("td.giai3").text().trim().split(" - ");
	// 			const giai4 = $(body).find("td.giai4").text().trim().split(" - ");
	// 			const giai5 = $(body).find("td.giai5").text().trim().split(" - ");
	// 			const giai6 = $(body).find("td.giai6").text().trim().split(" - ");
	// 			const giai7 = $(body).find("td.giai7").text().trim().split(" - ");
	// 			const giai8 = $(body).find("td.giai8").text().trim().split(" - ");
	// 			const ketqua = [
	// 				giai8,
	// 				giai7,
	// 				giai6,
	// 				giai5,
	// 				giai4,
	// 				giai3,
	// 				giai2,
	// 				giai1,
	// 				giaidb,
	// 			];
	// 			const ketquamoi = new ketquas({
	// 				dai: daiId._id,
	// 				loaive,
	// 				ngay,
	// 				ketqua,
	// 			});
	// 			res.json(ketquamoi);
	// 			console.log(ketquamoi);
	// 			// res.render("test", { body });
	// 		}
	// 	}
	// );

	// try {
	// 	const ketqua = await crawlData("ben-tre", "08-03-2022");
	// 	console.log("ketqua " + ketqua);
	// 	res.json(ketqua);
	// } catch (error) {
	// 	console.log("error");
	// }

	const dais = await DaiTheoNgay("3-8-2022", "mn");
	let result = [];
	for (const dai of dais) {
		const ketquamoi = await crawlData(dai.slug, "8-3-2022");
		result.push(ketquamoi);
	}
	res.json(result);
});

module.exports = route;
