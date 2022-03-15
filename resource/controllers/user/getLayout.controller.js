const mienModel = require("../../models/mien.model");
const daiModel = require("../../models/dai.model");
const thuModel = require("../../models/thu.model");

const getLayout = {
	getLayout: async (req, res) => {
		try {
			const miens = await mienModel.find();
			let result = [];
			for (const mien of miens) {
				const dais = await daiModel.find({ mien: mien._id }).sort("ten");
				result.push({ mien: mien, dais });
			}
			const today = new Date();
			const dsNaySo = [];
			const nayso = await thuModel.findById(today.getDay());
			for (const mien in nayso.dai) {
				if (nayso.dai.hasOwnProperty(mien)) {
					dsNaySo.push(...nayso.dai[mien]);
				}
			}
			res.status(200).json({ success: true, dsDai: result, dsNaySo });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
	},
};

module.exports = getLayout;
