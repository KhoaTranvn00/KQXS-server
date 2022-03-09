const express = require("express");
const route = express.Router();

const request = require("request");
const cheerio = require("cheerio");

const dais = require("../models/dai.model");
const ketquaModel = require("../models/ketqua.model");
const crawlDataMN = require("../utils/crawlDataMN");
const DaiTheoNgay = require("../utils/daiTheoNgay");
const formatterDate = require("../utils/formateDate");
const crawlDataMT = require("../utils/crawlDataMT");
const crawlDataMB = require("../utils/crawlDataMB");

route.get("/", async (req, res) => {
	const dais = await DaiTheoNgay(formatterDate.dayMonth("11-3-2022"), "mn");
	console.log(dais);
	let result = [];
	for (const dai of dais) {
		const ketquamoi = await crawlDataMN(dai.slug, "11-3-2022");
		result.push(ketquamoi);
	}
	try {
		const ketquamoi = await ketquaModel.create(result);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.json(error);
	}
});

module.exports = route;
