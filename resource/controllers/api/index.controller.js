const thuModel = require("../../models/thu.model");

class Api {
	async getDaiTheoNgay(req, res) {
		const ngay = new Date(req.params.ngay);
		const mien = req.params.mien;
		const thu = ngay.getDay();
		const populate = `dai.${mien}`;
		const daithu = await thuModel.findById(thu).populate(populate);
		const dais = daithu.dai[mien];
		res.render("api/dai-thu", { dais });
	}
}

module.exports = new Api();
