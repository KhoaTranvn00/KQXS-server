const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const user = require("./user.model");
const vemua = require("./vemua.model");

const ThongBaoSchema = new Schema({
	userId: { type: ObjectId, ref: user },
	message: { type: "String", required: true },
	veMuaId: { type: ObjectId, ref: vemua, unique: true },
	status: { type: "Boolean", required: true, default: false },
	createdAt: { type: "Date", required: true, default: Date.now },
});

module.exports = mongoose.model("thongbao", ThongBaoSchema);
