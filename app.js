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
        directives: {
            defaultSrc:["'none'"],
            scriptSrc:["'self'", "https://strict-dynamic",(req, res) => `'nonce-${res.locals.nonce}'`, "/coreFunctions.js", "/goalDisplay.js", "/progress.js", "script.js", "https://kit.fontawesome.com", "https://vercel.live"],
            imgSrc: [
                "'self'",              // Allow images from your own domain
                "https://water-plus-drab.vercel.app",  // Allow images from your Vercel app
                "data:"                // Allow data URIs (useful for inline base64-encoded images)
              ],
            connectSrc:["'self'", "https://ka-f.fontawesome.com"],
            objectSrc:["'self'"],
            scriptSrcAttr:["'self'"],
            reportUri:"/csp-violation-report-endpoint"
        },
        cookies: {
            secure: true
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