const express = require("express");
const route = express.Router();

const controller = require("../../controllers/api/index.controller");

route.get("/dai-ngay/:ngay/:mien", controller.getDaiTheoNgay);

module.exports = route;
