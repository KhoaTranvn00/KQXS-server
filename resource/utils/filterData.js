const filterData = {
	getFilterTG: (tg) => {
		let ngay;
		const today = new Date();
		switch (tg) {
			case "today":
				ngay = new Date();
				ngay.setHours(0, 0, 0, 0);

				break;
			case "3dago":
				ngay = new Date();
				ngay.setDate(ngay.getDate() - 3);
				ngay.setHours(0, 0, 0, 0);
				break;

			case "month":
				ngay = new Date();
				ngay.setMonth(ngay.getMonth() - 1);
				ngay.setHours(0, 0, 0, 0);
				break;
			default:
				break;
		}
		if (tg !== "future") {
			return { $gte: ngay, $lte: today };
		} else {
			return { $gte: today };
		}
	},
};

module.exports = filterData;
