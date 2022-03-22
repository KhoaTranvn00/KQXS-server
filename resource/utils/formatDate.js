const formatDate = {
	// data: dd-mm-yyyy
	dayMonth: (dateString) => {
		const date = dateString.split("-");
		const result = `${date[1]}-${date[0]}-${date[2]}`;
		return result;
	},
	ymdTmdy: (dateString) => {
		const date = dateString.split("-");
		const result = `${date[1]}-${date[2]}-${date[0]}`;
		return result;
	},
	ymdTdmy: (dateString) => {
		const date = dateString.split("-");
		const result = `${date[2]}-${date[1]}-${date[0]}`;
		return result;
	},
};

module.exports = formatDate;
