const request = require("request-promise");
const cheerio = require("cheerio");

const formatDate = require("./formatDate");

const crawlDataMN = async (dai, ngay) => {
	let result = null;
	const url = `https://xosodacbiet.com/xsmb/ngay-${ngay}`;
	console.log(url);
	await request.get(url, (err, response, body) => {
		if (err) {
			console.log(err);
		} else {
			const $ = cheerio.load(body);
			const giaidb = $(body).find(".v-gdb ").text().trim();
			const giai1 = $(body).find(".v-g1").text().trim();
			const giai20 = $(body).find(".v-g2-0").text().trim();
			const giai21 = $(body).find(".v-g2-1").text().trim();
			const giai30 = $(body).find(".v-g3-0").text().trim();
			const giai31 = $(body).find(".v-g3-1").text().trim();
			const giai32 = $(body).find(".v-g3-2").text().trim();
			const giai33 = $(body).find(".v-g3-3").text().trim();
			const giai34 = $(body).find(".v-g3-4").text().trim();
			const giai35 = $(body).find(".v-g3-5").text().trim();
			const giai40 = $(body).find(".v-g4-0").text().trim();
			const giai41 = $(body).find(".v-g4-1").text().trim();
			const giai42 = $(body).find(".v-g4-2").text().trim();
			const giai43 = $(body).find(".v-g4-3").text().trim();
			const giai50 = $(body).find(".v-g5-0").text().trim();
			const giai51 = $(body).find(".v-g5-1").text().trim();
			const giai52 = $(body).find(".v-g5-2").text().trim();
			const giai53 = $(body).find(".v-g5-3").text().trim();
			const giai54 = $(body).find(".v-g5-4").text().trim();
			const giai55 = $(body).find(".v-g5-5").text().trim();
			const giai60 = $(body).find(".v-g6-0").text().trim();
			const giai61 = $(body).find(".v-g6-1").text().trim();
			const giai62 = $(body).find(".v-g6-2").text().trim();
			const giai70 = $(body).find(".v-g7-0").text().trim();
			const giai71 = $(body).find(".v-g7-1").text().trim();
			const giai72 = $(body).find(".v-g7-2").text().trim();
			const giai73 = $(body).find(".v-g7-3").text().trim();
			const ketqua = [
				[giaidb],
				[giai1],
				[giai20, giai21],
				[giai30, giai31, giai32, giai33, giai34, giai35],
				[giai40, giai41, giai42, giai43],
				[giai50, giai51, giai52, giai53, giai54, giai55],
				[giai60, giai61, giai62],
				[giai70, giai71, giai72, giai73],
			];
			// console.log(ketqua);
			result = { ketqua };
		}
	});

	result = {
		...result,
		dai: dai._id,
		ngay: new Date(formatDate.dayMonth(ngay)),
	};
	console.log(result);
	return result;
};

module.exports = crawlDataMN;
