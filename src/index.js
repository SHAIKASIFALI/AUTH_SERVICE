const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { apiDocumentation } = require("../docs/apiDocumentation");
const swaggerUi = require("swagger-ui-express");
const apiRouter = require("./routes/index");
const { PORT } = require("./config/serverConfig");
const db = require("./models/index");
const { DB_SYNC } = require("./config/serverconfig");

const app = express();

const startAndSetupServer = async () => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use("/authservice/api", apiRouter);
  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
  app.listen(PORT, () => {
    if (DB_SYNC) db.sequelize.sync({ alert: true });
    console.log(`server is started and listening at ${PORT}`);
  });
};

startAndSetupServer();
