class Admin {
	getIndex(req, res) {
		res.json("controller");
	}
}

module.exports = new Admin();
