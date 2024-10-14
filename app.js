const express = require("express");
const app = express();
const path = require("path");
const port = 7000;
const helmet = require("helmet");
const crypto = require("crypto")

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(32).toString("hex");
    next();
})

app.use(helmet())
app.use(helmet({
    contentSecurityPolicy : {
        directives: {
            defaultSrc:["'self'"],
            scriptSrc:["'self'", "https://strict-dynamic", (req, res) => `'nonce-${res.locals.nonce}'`],
            imgSrc:["'self'"],
            connectSrc:["'self'", "https://ka-f.fontawesome.com"],
            scriptSrcAttr:["'self'", "'unsafe-inline'"]
        },
        cookies: {
            sameSite: 'None',
            secure: true
        }
    }
}))

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