const route = require("express").Router();

const controller = require("../../controllers/agent/index.controller");
const middleware = require("../../controllers/user/middleware.controller");

// route.post(
// 	"/dang-ve-so-le",
// 	middleware.verifyAgentToken,
// 	controller.upLotteryRetail
// );
route.post(
	"/dang-ve-so-seri",
	middleware.verifyAgentToken,
	controller.upLotterySeri
);
route.get(
	"/ve-da-dang",
	middleware.verifyAgentToken,
	controller.getPostedLottery
);
route.get(
	"/thong-bao",
	middleware.verifyAgentToken,
	controller.getThongBaoAgent
);

module.exports = route;
