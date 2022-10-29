const dateUtils = {
	compareDate: (date1, date2) => {
		if (date1.getFullYear() < date2.getFullYear()) return 2;
		if (
			date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() < date2.getMonth()
		)
			return 2;
		if (
			date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() < date2.getDate()
		)
			return 2;
		if (
			date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()
		)
			return 0;
		return 1;
	},

	verifyToday: () => {
		const today = new Date();
		if (today.getHours() < 15) return true;
	},

	getToday: () => {
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		return today;
	},

	getTomorrow: () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);
		return tomorrow;
	},
};

module.exports = dateUtils;
