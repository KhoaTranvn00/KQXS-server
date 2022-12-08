const request = require("request-promise");
const cheerio = require("cheerio");
const formatDate = require("./formatDate");

const crawlDataMN = async (dai, ngay) => {
	let result = null;
	const url = `https://xsdb.me/xsmn/xs${dai.kihieu}/ngay-${ngay}`;
	console.log(url);
	await request.get(url, (err, response, body) => {
		if (err) {
			console.log(err);
		} else {
			const $ = cheerio.load(body);
			const giaidb = $(body).find(".v-gdb ").text().trim();
			const giai1 = $(body).find(".v-g1").text().trim();
			const giai2 = $(body).find(".v-g2").text().trim();
			const giai30 = $(body).find(".v-g3-0").text().trim();
			const giai31 = $(body).find(".v-g3-1").text().trim();
			const giai40 = $(body).find(".v-g4-0").text().trim();
			const giai41 = $(body).find(".v-g4-1").text().trim();
			const giai42 = $(body).find(".v-g4-2").text().trim();
			const giai43 = $(body).find(".v-g4-3").text().trim();
			const giai44 = $(body).find(".v-g4-4").text().trim();
			const giai45 = $(body).find(".v-g4-5").text().trim();
			const giai46 = $(body).find(".v-g4-6").text().trim();
			const giai5 = $(body).find(".v-g5").text().trim();
			const giai60 = $(body).find(".v-g6-0").text().trim();
			const giai61 = $(body).find(".v-g6-1").text().trim();
			const giai62 = $(body).find(".v-g6-2").text().trim();
			const giai7 = $(body).find(".v-g7").text().trim();
			const giai8 = $(body).find(".v-g8").text().trim();
			const ketqua = [
				[giaidb],
				[giai1],
				[giai2],
				[giai30, giai31],
				[giai40, giai41, giai42, giai43, giai44, giai45, giai46],
				[giai5],
				[giai60, giai61, giai62],
				[giai7],
				[giai8],
			];
			result = { ketqua };
		}
	});

	result = {
		...result,
		dai: dai._id,
		ngay: new Date(formatDate.dayMonth(ngay)),
	};
	return result;
};

module.exports = crawlDataMN;
