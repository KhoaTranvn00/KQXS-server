const { Schema } = require("mongoose");

const UserScheme = new Schema({
	username: { type: "String", required: true, unique: true },
	password: { type: "String", required: true },
	notify: [],
});
