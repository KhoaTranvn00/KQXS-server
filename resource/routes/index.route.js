const express = require("express");
const route = express.Router();

const adminRoute = require("./admin/index.route");
const apiRoute = require("./utils/index.route");
const testRoute = require("./test.route");

route.use("/api", apiRoute);
route.use("/admin", adminRoute);
route.use("/test", testRoute);

module.exports = route;
