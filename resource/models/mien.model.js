const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectId;

const MienSchema = new Schema({
	_id: { type: "String", required: true },
	ten: { type: "String", required: true },
});

module.exports = mongoose.model("mien", MienSchema);
