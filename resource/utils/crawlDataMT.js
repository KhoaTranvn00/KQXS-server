const request = require("request-promise");
const cheerio = require("cheerio");

const dais = require("../models/dai.model");
const ketQuaModel = require("../models/ketqua.model");

const crawlDataMT = async (daiSlug, ngaySo) => {
	let result = null;
	let dai = "";
	const url = `https://www.minhngoc.com.vn/getkqxs/${daiSlug}/${ngaySo}.js`;
	await request.get(url, (err, response, body) => {
		if (err) {
			console.log(err);
		} else {
			const $ = cheerio.load(body);
			dai = $(body).find("div.title").text().trim().slice(5);

			const ngaytho = $(body).find("td.ngay").text().trim().slice(6).split("/");
			const ngay = new Date(ngaytho[2], ngaytho[1] - 1, ngaytho[0]);
			const giaidb = $(body).find("td.giaidb").text().trim().split(" - ");
			const giai1 = $(body).find("td.giai1").text().trim().split(" - ");
			const giai2 = $(body).find("td.giai2").text().trim().split(" - ");
			const giai3 = $(body).find("td.giai3").text().trim().split(" - ");
			const giai4 = $(body).find("td.giai4").text().trim().split(" - ");
			const giai5 = $(body).find("td.giai5").text().trim().split(" - ");
			const giai6 = $(body).find("td.giai6").text().trim().split(" - ");
			const giai7 = $(body).find("td.giai7").text().trim().split(" - ");
			const giai8 = $(body).find("td.giai8").text().trim().split(" - ");
			const ketqua = [
				giai8,
				giai7,
				giai6,
				giai5,
				giai4,
				giai3,
				giai2,
				giai1,
				giaidb,
			];
			result = { ngay, ketqua };
		}
	});
	const daiId = await dais.findOne({ ten: dai });
	result = { ...result, dai: daiId._id };
	return result;
};

module.exports = crawlDataMT;
