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
const marocannonesCtrl = require("./controllers/scrappingMarocAnnonce");
const emploimaCtrl = require("./controllers/scrappingEmploiMA");
const linkedinCtrl = require("./controllers/scrappingLinkedIn");
const rmmcCtrl = require("./controllers/rmmcProcessing");
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
// cron.schedule("0 0 * * *", async () => {
  anapecCtrl.anapec_html();
// });
marocannonesCtrl.marocannonces_html();
emploimaCtrl.emploima_html();
linkedinCtrl.linkedin_html();
// marocannonesCtrl.marocannonces_html_from_file();
/******************************** Periodic operations ********************************/


/******************************** rmmc operations ********************************/

// rmmcCtrl.remove_punctuation_activite();
// rmmcCtrl.remove_punctuation_connaissanceprocedurale();
// rmmcCtrl.remove_punctuation_connaissancetheorique();
// rmmcCtrl.remove_punctuation_savoirfaire();
// rmmcCtrl.remove_punctuation_savoir();

// rmmcCtrl.remove_duplicates_savoir();
// rmmcCtrl.remove_duplicates_activite();
// rmmcCtrl.remove_duplicates_connaissanceprocedurale();
// rmmcCtrl.remove_duplicates_connaissancetheorique();
// rmmcCtrl.remove_duplicates_savoirfaire();

// rmmcCtrl.delete_activites();
// rmmcCtrl.delete_connaissanceprocedurales();
// rmmcCtrl.delete_connaissancetheoriques();
// rmmcCtrl.delete_savoirfaires();
// rmmcCtrl.delete_savoirs();


// rmmcCtrl.delete_job_nomenclature_orphan_refrences();

module.exports = app;
