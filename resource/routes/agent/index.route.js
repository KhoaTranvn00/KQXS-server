const route = require("express").Router();

const controller = require("../../controllers/agent/index.controller");
const middleware = require("../../controllers/user/middleware.controller");

route.post("/dang-ve-so", middleware.verifyAgentToken, controller.upLottery);

module.exports = route;
