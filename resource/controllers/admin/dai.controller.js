const daiModel = require("../../models/dai.model");

class Dai {
	async getIndex(req, res) {
		const dais = await daiModel.find({}).populate("mien");
		res.render("admin/dai/index", { dais });
	}

	getAdd(req, res) {
		res.render("admin/dai/add");
	}
}

module.exports = new Dai();
