const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = require("./user.model");
const dai = require("./dai.model");

const ObjectId = mongoose.Schema.Types.ObjectId;

const VemuaSchema = new Schema({
	userId: { type: ObjectId, ref: user },
	veso: { type: "String", require: true },
	soluong: { type: "Number", default: 1, require: true },
	daiId: { type: ObjectId, ref: dai, require: true },
	ngay: { type: "Date", require: true },
	status: { type: "Number", default: 0 },
	// 0: chua do
	// 1: ko trung
	// 2: trung
});

module.exports = mongoose.model("vemua", VemuaSchema);
