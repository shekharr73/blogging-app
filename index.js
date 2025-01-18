const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.listen(port, () => console.log(`Server Started at PORT:${PORT}`));
