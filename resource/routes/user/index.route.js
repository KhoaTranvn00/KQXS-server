const route = require("express").Router();

const getKQXSRoute = require("./getKQXS.route");
const authRoute = require("./auth.route");
const controller = require("../../controllers/user/index.controller");
const middleware = require("../../controllers/user/middleware.controller");

route.use("/getKQXS", getKQXSRoute);
route.use("/auth", authRoute);
route.get("/getlayout", controller.getLayout);
route.post("/do-kq", controller.doKQ);
route.post("/mua-ve-so", middleware.verifyToken, controller.muaVeSo);
route.get("/ve-da-mua", middleware.verifyToken, controller.veDaMua);
route.get("/get-ve-de-mua", middleware.verifyToken, controller.getVeSoDeMua);
route.get("/get-ve-da-mua", middleware.verifyToken, controller.getVeSoDaMua);
route.get("/get-thong-bao", middleware.verifyToken, controller.getThongBao);

module.exports = route;
