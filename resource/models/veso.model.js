const mongoose = require("mongoose");
const daiModel = require("./dai.model");
const thuModel = require("./thu.model");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const user = require("./user.model");
const vemua = require("./vemua.model");

const VesoSchema = new Schema({
	veso: { type: "String", required: true, length: 6 },
	dai: { type: ObjectId, ref: daiModel },
	ngay: { type: Date },
	thu: { type: "Number", ref: thuModel },
	kihieu: { type: "String", required: true },
	soluong: { type: "Number", required: true },
});

module.exports = mongoose.model("veso", VesoSchema);
