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

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})