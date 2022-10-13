const route = require("express").Router();

const controller = require("../../controllers/utils/utils.controller");

route.get("/dai-theo-ngay-mien/:ngay/:mien", controller.getDaiTheoNgayMien);
route.get("/dai-theo-ngay/:ngay", controller.getDaiTheoNgay);

module.exports = route;
