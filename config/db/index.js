const mongoose = require("mongoose");

async function connect() {
	try {
		await mongoose.connect("mongodb://localhost:27017/KQXS", {
			useNewUrlParser: true,
		});
		console.log("Connect Successfully!!");
	} catch (error) {
		console.log("Connect Fail!!!!!!!!", error);
	}
}

module.exports = { connect };
