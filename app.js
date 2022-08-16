require("dotenv").config();
require("./utils/db-connection.util");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/winston.util");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { exceptionHandler } = require("./exceptionHandling");

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
require("./routes/index.route")(app);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load("./documentation/swagger.yaml"))
);

// error handler
app.use((err, req, res, _next) => {
  return exceptionHandler(err, req, res);
});

module.exports = app;
