const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const dai = require("./dai.model");
const thu = require("./thu.model");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const KetQuaSchema = new Schema({
	// ten: { type: "String", required: true },
	ketqua: [{ type: "Array", required: true }],
	loaive: { type: "String", required: true },
	dai: { type: ObjectId, ref: dai, required: true },
	ngay: { type: "Date", required: true },
	thu: { type: "Number", ref: thu },
});

module.exports = mongoose.model("ketQua", KetQuaSchema);
