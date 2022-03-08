const inputNgay = $("#ngay");
const inputMien = $("#mien");
const inputDai = $("#dai");

const handleInputChange = () => {
	const url = `http://localhost:3000/api/dai-ngay/${inputNgay.val()}/${inputMien.val()}`;
	$.get(url, (data) => {
		inputDai.html(data);
	});
};

inputNgay.change(() => handleInputChange());
inputMien.change(() => handleInputChange());
