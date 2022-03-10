const route = require("express").Router();

const controller = require("../../controllers/user/getKQXS.controller");

route.get("/mien-nam/ngay/:ngay", controller.ngayMN);
route.get("/mien-nam/thu/:slug", controller.thuMN);

module.exports = route;
