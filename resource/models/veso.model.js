const mongoose = require("mongoose");
const daiModel = require("./dai.model");
const thuModel = require("./thu.model");
const userModel = require("./user.model");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const user = require("./user.model");
const vemua = require("./vemua.model");

const VesoSchema = new Schema({
	agentId: { type: ObjectId, ref: userModel, required: true },
	veso: { type: "String", required: true, length: 6 },
	daiId: { type: ObjectId, ref: daiModel },
	ngay: { type: Date },
	thuId: { type: "Number", ref: thuModel },
	kihieu: { type: "String", required: true },
	soluong: { type: "Number", required: true },
});

module.exports = mongoose.model("veso", VesoSchema);
