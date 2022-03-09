const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const dai = require("./dai.model");
const thu = require("./thu.model");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const KetQuaSchema = new Schema({
	ketqua: [{ type: "Array", required: true }],
	loaive: { type: "String" },
	dai: { type: ObjectId, ref: dai, required: true, index: true },
	ngay: { type: "Date", required: true, index: true },
	thu: { type: "Number", ref: thu },
});

KetQuaSchema.index({ dai: 1, ngay: 1 }, { unique: true });

module.exports = mongoose.model("ketQua", KetQuaSchema);
