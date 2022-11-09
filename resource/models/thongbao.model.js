const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const user = require("./user.model");
const vemua = require("./vemua.model");
const veso = require("./veso.model");

const ThongBaoSchema = new Schema({
	userId: { type: ObjectId, ref: user, required: true },
	message: { type: "String", required: true },
	vesoId: { type: ObjectId, ref: veso, required: true },
	status: { type: "Boolean", required: true, default: false },
	role: { type: "Number", default: 1, required: true, max: 2 },
	createdAt: { type: "Date", required: true, default: Date.now },
});

module.exports = mongoose.model("thongbao", ThongBaoSchema);
