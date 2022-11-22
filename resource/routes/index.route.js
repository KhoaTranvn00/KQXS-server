const express = require("express");
const route = express.Router();

const testRoute = require("./test.route");
const adminRoute = require("./admin/index.route");
const agentRoute = require("./agent/index.route");
const userRoute = require("./user/index.route");
const utilsRoute = require("./utils/utils.route");
const payRoute = require("./utils/pay.route");

route.use("/test", testRoute);
route.use("/user", userRoute);
route.use("/admin", adminRoute);
route.use("/agent", agentRoute);
route.use("/pay", payRoute);
route.use("/", utilsRoute);

module.exports = route;
