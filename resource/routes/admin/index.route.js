const route = require("express").Router();

const setKQXSRoute = require("./setKQXS.route");

const middleware = require("../../controllers/user/middleware.controller");
const controller = require("../../controllers/admin/auth.controller");
const adminController = require("../../controllers/admin/admin.controller");

route.use("/setKQXS", setKQXSRoute);
route.post("/auth/login", controller.login);
route.get("/auth/load", middleware.verifyTokenAdmin, controller.loadAdmin);
// route.get("/get-ve-mua", middleware.verifyTokenAdmin, adminController.getVeMua);
route.get("/get-ve-mua", adminController.getVeMua);

module.exports = route;
