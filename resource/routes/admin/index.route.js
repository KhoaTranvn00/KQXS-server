const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/admin.controller");

const daiRoute = require("./dai.route");
const ketquaRoute = require("./ketqua.route");

route.use("/ketqua", ketquaRoute);
route.use("/dai", daiRoute);

module.exports = route;
