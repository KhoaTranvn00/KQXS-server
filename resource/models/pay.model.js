const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaySchema = new Schema({
	_id: { type: "String" },
});

module.exports = mongoose.model("pay", PaySchema);
