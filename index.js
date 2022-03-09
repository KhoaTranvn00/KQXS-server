const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./config/db");
const route = require("./resource/routes/index.route");
const PORT = 3000;

// Connect DB
db.connect();

app.use(express.json()); // for parsing application/json
app.use(cors());

app.use("/api", route);

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
