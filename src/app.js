const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
var cron = require("node-cron");
const cookieParser = require("cookie-parser");
const app = express();

// the routes
const initRoutes = require("./routes/InitDBRoute");
const scrappingRoutes = require("./routes/scrappingRoute");
// scrapping controllers
const anapecCtrl = require("./controllers/scrappingAnapec");
// add Access-Control-Allow-Origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//parse json
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(expressValidator());
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("PHD MA Jobs Node 14");
});

app.use("/init", initRoutes);

app.use("/scrapping", scrappingRoutes);


app.use("/uploads", express.static("uploads"));


/******************************** DEV SCRAPPINGS ********************************/


/******************************** PROD SCRAPPINGS ********************************/
anapecCtrl.anapec_html();

/******************************** Periodic operations ********************************/

module.exports = app;
