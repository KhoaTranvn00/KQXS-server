const route = require("express").Router();

const controller = require("../../controllers/user/getKQXS.controller");

route.get("/mien-nam/ngay/:ngay", controller.ngayMN);
route.get("/mien-trung/ngay/:ngay", controller.ngayMT);
route.get("/mien-bac/ngay/:ngay", controller.ngayMB);

route.get("/mien-nam/thu/:slug", controller.thuMN);
route.get("/mien-trung/thu/:slug", controller.thuMT);
route.get("/mien-bac/thu/:slug", controller.thuMB);

route.get("/:slug", controller.daiMN);

module.exports = route;
