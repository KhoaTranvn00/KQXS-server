const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema({
	// 0 - admin
	// 1 - nguoi ban
	// 2 - nguoi mua
	_id: { type: "Number", min: 0, max: 2 },
	name: { type: "String" },
});

module.exports = mongoose.model("role", RoleSchema);
