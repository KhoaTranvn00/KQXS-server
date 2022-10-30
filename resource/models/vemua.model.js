const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("./user.model");
const dai = require("./dai.model");
const vesoModel = require("./veso.model");

const ObjectId = mongoose.Schema.Types.ObjectId;

const VemuaSchema = new Schema({
	userId: { type: ObjectId, ref: userModel },
	vesoId: { type: ObjectId, ref: vesoModel },
	soluong: { type: "Number", default: 1, require: true },
});

module.exports = mongoose.model("vemua", VemuaSchema);
