const express = require("express");
const route = express.Router();

const testRoute = require("./test.route");
const adminRoute = require("./admin/index.route");

route.use("/test", testRoute);
route.use("/admin", adminRoute);

module.exports = route;
