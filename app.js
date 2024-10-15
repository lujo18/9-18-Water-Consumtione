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


app.use(helmet({
    contentSecurityPolicy: {
        useDefaults:false,
        directives: {
            defaultSrc:["'self'"],
            scriptSrc:["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "https://vercel.live", "coreFunctions.js", "goalDisplay.js", "progress.js", "script.js", "https://kit.fontawesome.com"],
            imgSrc: [
                "'self'", 
                "https://vercel.live",             // Allow images from your own domain
                "data:"                // Allow data URIs (useful for inline base64-encoded images)
              ],
            connectSrc:["'self'", "https://ka-f.fontawesome.com", "https://vercel.live"],
            objectSrc:["'self'"],
            scriptSrcAttr:["'self'", "https://vercel.live"],
            reportUri:"/csp-violation-report-endpoint"
        },
        reportOnly: true,
    }
}))

app.post("/csp-violation-report-endpoint", express.json(), (req, res) => {
    console.log("CSP Violation: " + req.body);
    res.status(204).end()
})

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

module.exports = app