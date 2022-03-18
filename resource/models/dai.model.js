const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

const mien = require("./mien.model");

const DaiSchema = new Schema({
	ten: { type: "String", required: true },
	slug: { type: "String", slug: "ten", unique: true },
	kihieu: { type: "String", unique: true },
	mien: { type: "String", required: true, ref: mien },
});

module.exports = mongoose.model("dai", DaiSchema);
