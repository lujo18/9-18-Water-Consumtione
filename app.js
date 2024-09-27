const express = require("express");
const app = express();
const path = require("path");
const port = 7000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("home", {});
})

app.get("/goal", (req, res) => {
    res.render("goal", {});
})

app.get("/progress", (req, res) => {
    res.render("progress", {})
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})