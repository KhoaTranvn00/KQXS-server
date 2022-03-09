const thuModel = require("../models/thu.model");

// ngay: thang-ngay-nam
const DaiTheoNgay = async (ngay, mien) => {
	const date = new Date(ngay);
	const thu = date.getDay();
	const populate = `dai.${mien}`;
	const daithu = await thuModel.findById(thu).populate(populate);
	const dais = daithu.dai[mien];
	return dais;
};

module.exports = DaiTheoNgay;
