const mongoose = require("mongoose");
const roleModel = require("./role.model");
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
	username: { type: "String", required: true, unique: true },
	password: { type: "String", required: true },
	address: { type: "String", required: false },
	phone: { type: "String", required: false },
	role: { type: "Number", ref: roleModel, default: 2 },
});

module.exports = mongoose.model("user", UserSchema);
