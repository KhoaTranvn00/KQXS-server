const route = require("express").Router();

const controller = require("../../controllers/admin/setKQXS.controller");

route.post("/mien-nam/:ngay", controller.setMN);
route.post("/mien-trung/:ngay", controller.setMT);
route.post("/mien-bac/:ngay", controller.setMB);

module.exports = route;
