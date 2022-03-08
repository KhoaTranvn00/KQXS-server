const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/vedo.controller");

route.get("/them-moi", controller.getAdd);

module.exports = route;
