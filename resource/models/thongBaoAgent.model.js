const mongoose = require("mongoose");
const userModel = require("./user.model");
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const vesoModel = require("./veso.model");

const ThongBaoAgentSchema = new Schema({
	agentId: { type: ObjectId, ref: userModel, required: true },
	ngay: { type: Date },
	vesos: [
		{
			vesoId: { type: ObjectId, ref: vesoModel, require: true },
			soVeE: { type: "Number", required: true },
		},
	],
});

module.exports = mongoose.model("thongBaoAgent", ThongBaoAgentSchema);
