const route = require("express").Router();

const getKQXSRoute = require("./getKQXS.route");
const authRoute = require("./auth.route");
const controller = require("../../controllers/user/index.controller");

route.use("/getKQXS", getKQXSRoute);
route.use("/auth", authRoute);
route.get("/getlayout", controller.getLayout);
route.post("/do-kq", controller.doKQ);

module.exports = route;
