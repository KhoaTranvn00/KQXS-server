const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const dai = require("./dai.model");
const mien = require("./mien.model");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ThuSchema = new Schema({
	// thứ từ hàm getDay -> 0-6 : chủ nhật - thứ 7
	_id: { type: "Number", min: 0, max: 6 },
	thu: { type: "String", required: true, unique: true },
	slug: { type: "String", slug: "ten", unique: true },
	dai: {
		mn: [{ type: ObjectId, ref: dai }],
		mt: [{ type: ObjectId, ref: dai }],
		mb: [{ type: ObjectId, ref: dai }],
	},
});

module.exports = mongoose.model("thu", ThuSchema);
