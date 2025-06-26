const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("PDF Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
