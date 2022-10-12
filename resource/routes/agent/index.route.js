const route = require("express").Router();

const controller = require("../../controllers/agent/index.controller");
const middleware = require("../../controllers/user/middleware.controller");

route.post("/upLottery", controller.);
route.post("/login", controller.login);
route.get("/load", middleware.verifyToken, controller.loadUser);

module.exports = route;
