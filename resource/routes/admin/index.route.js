const route = require("express").Router();

const setKQXSRoute = require("./setKQXS.route");

route.use("/setKQXS", setKQXSRoute);

module.exports = route;
