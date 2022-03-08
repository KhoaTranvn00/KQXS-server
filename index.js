const express = require("express");
const app = express();

const db = require("./config/db");
const route = require("./resource/routes/index.route");
const PORT = 3000;

// Connect DB
db.connect();

app.use("/api", route);

app.use(express.json()); // for parsing application/json

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
