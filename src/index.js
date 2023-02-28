const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./routes/index");
const { PORT } = require("./config/serverConfig");
const db = require("./models/index");

const { DB_SYNC } = require("./config/serverconfig");
const app = express();
const startAndSetupServer = async () => {
  if (DB_SYNC) db.sequelize.sync({ alert: true });
  app.use(bodyParser.json());
  app.use(cors());
  console.log(PORT);
  app.use("/api", apiRouter);
  app.listen(PORT, () => {
    console.log(`server is started and listening at ${PORT}`);
  });
};

startAndSetupServer();
