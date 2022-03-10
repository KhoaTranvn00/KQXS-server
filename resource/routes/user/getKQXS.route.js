const route = require("express").Router();

const controller = require("../../controllers/user/getKQXS.controller");

route.get("/mien-nam/ngay/:ngay", controller.ngayMN);

module.exports = route;
