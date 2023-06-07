const express = require("express");
const mongoose = require("mongoose");
const sessionMiddleware = require("./sessionMiddleware");
require("dotenv").config();
const path = require('path');


const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views') || path.join(__dirname, "resources/app/"));


const uri = process.env.DATA_URL;

const stageRoutes = require("./routes/stages");
const startpageRoutes = require("./routes/startpage");
const loginRoutes = require("./routes/login");
const registerationRoutes = require("./routes/registeration");
const stage1Routes = require("./routes/stage1");
const profilePage = require("./routes/profileRouter");
const s1ResultRoutes = require("./routes/stage1Result");
const s2ResultRoutes = require("./routes/stage2Result");
const stage2Routes = require("./routes/stage2");

const apiRouter = require("./api");
app.use("/api", apiRouter);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware.sessionMiddleware);

const { isUserSignedIn } = require("./sessionMiddleware");

app.use("/stageSelect", stageRoutes);
app.use("/login", loginRoutes);
app.use("/stage1", isUserSignedIn, stage1Routes);
app.use("/profile", isUserSignedIn, profilePage);
app.use("/registeration", registerationRoutes);
app.use("/stage1Result", isUserSignedIn, s1ResultRoutes);
app.use("/stage2Result", isUserSignedIn, s2ResultRoutes);
app.use("/stage2", isUserSignedIn, stage2Routes);
app.use("/", startpageRoutes);

async function connect() {
  try {
    mongoose.connect(uri);
    console.log("Connected to MongoDB server");
    // Additional code related to your application's logic
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.
http://localhost:${PORT}`);
});
