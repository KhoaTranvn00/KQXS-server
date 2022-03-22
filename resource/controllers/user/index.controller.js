const mienModel = require("../../models/mien.model");
const daiModel = require("../../models/dai.model");
const thuModel = require("../../models/thu.model");
const ketquaModel = require("../../models/ketqua.model");
const formatDate = require("../../utils/formatDate");

// return lại giải trung: 0-8 nếu ko trúng return -1
const doXoSo = (veso, ketqua) => {
	let result = -1;
	for (const [giai, kqs] of ketqua.entries()) {
		if (result !== -1) break;
		for (const kq of kqs) {
			if (veso.slice(-kq.length) == kq) {
				result = giai;
				break;
			}
		}
	}
	return result;
};

const index = {
	getLayout: async (req, res) => {
		try {
			const miens = await mienModel.find();
			let result = [];
			for (const mien of miens) {
				const dais = await daiModel.find({ mien: mien._id }).sort("ten");
				result.push({ mien: mien, dais });
			}
			const today = new Date();
			const dsNaySo = [];
			const nayso = await thuModel.findById(today.getDay());
			for (const mien in nayso.dai) {
				if (nayso.dai.hasOwnProperty(mien)) {
					dsNaySo.push(...nayso.dai[mien]);
				}
			}
			res.status(200).json({ success: true, dsDai: result, dsNaySo });
		} catch (error) {
			console.log(error);
			res.status(400).json({ success: false, message: error.message });
		}
	},

	doKQ: async (req, res) => {
		const { ngay, dai, veso } = req.body;
		console.log(req.body);
		if (!ngay || !veso) {
			return res.status(400).json({
				success: false,
				message: "Bạn chưa nhập đủ thông tin",
			});
		}
		const { value: daiId, label: daiTen } = dai;
		const ngayQ = new Date(formatDate.ymdTmdy(ngay));
		try {
			const ketqua = await ketquaModel.findOne({ ngay: ngayQ, dai: daiId });
			const kq = doXoSo(veso, ketqua.ketqua);
			let message = "";
			switch (kq) {
				case -1:
					message = `Tiếc quá vé số ${veso} của bạn không trúng  KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)} rùi`;
					break;
				case 0:
					message = `Chúc mừng bạn đã trúng giải Đặc biệt KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)}`;
					break;
				default:
					message = `Chúc mừng bạn đã trúng giải ${kq} KQXS đài ${daiTen} xổ ngày: ${formatDate.ymdTdmy(
						ngay
					)}`;
					break;
			}
			res.json({ success: true, ketqua: kq !== -1, message });
		} catch (error) {
			console.log(error);
			res
				.status(400)
				.json({ success: false, message: "Kết quả không tìm tháy" });
		}
	},
};

module.exports = index;
