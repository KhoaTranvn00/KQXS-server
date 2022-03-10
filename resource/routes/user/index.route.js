const route = require("express").Router();

const getKQXSRoute = require("./getKQXS.route");

route.use("/getKQXS", getKQXSRoute);

module.exports = route;
