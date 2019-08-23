const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(routes);

app.listen(8001, () => {
    console.log("server running!");
})