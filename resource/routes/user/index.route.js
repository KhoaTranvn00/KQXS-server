const route = require("express").Router();

const getKQXSRoute = require("./getKQXS.route");
const getLayoutController = require("../../controllers/user/getLayout.controller");

route.use("/getKQXS", getKQXSRoute);
route.get("/getlayout", getLayoutController.getLayout);

module.exports = route;
