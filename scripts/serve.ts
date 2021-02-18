import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("OK");
});

app.listen(3000, () => {
  console.log("started serving...");
});
