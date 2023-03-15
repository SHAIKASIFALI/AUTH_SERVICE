const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const apiRouter = require("./routes/index");
const { PORT } = require("./config/serverConfig");
const db = require("./models/index");
const { DB_SYNC } = require("./config/serverconfig");

const app = express();

const startAndSetupServer = async () => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use("/authservice/api", apiRouter);
  app.listen(PORT, () => {
    if (DB_SYNC) db.sequelize.sync({ alert: true });
    console.log(`server is started and listening at ${PORT}`);
  });
};

startAndSetupServer();
