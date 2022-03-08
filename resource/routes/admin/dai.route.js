const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/dai.controller");

route.get("/them-moi", controller.getAdd);
route.get("/", controller.getIndex);

module.exports = route;
