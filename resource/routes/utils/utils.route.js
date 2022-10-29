const route = require("express").Router();

const controller = require("../../controllers/utils/utils.controller");

route.get("/dai-theo-ngay-mien/:ngay/:mien", controller.getDaiTheoNgayMien);
route.get("/dai-mien-nam-theo-ngay/:ngay", controller.getDaiMienNamTheoNgay);
route.get("/dai-theo-ngay/:ngay", controller.getDaiTheoNgay);
route.get("/full-dai-mien-nam", controller.getFullDaiMienNam);

module.exports = route;
