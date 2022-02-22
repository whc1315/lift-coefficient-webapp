require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

rollbar.log("Hello world!");

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("hit");
  rollbar.log("Someone hit the server!");
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/", (req, res) => {
  console.log("hit");
  rollbar.log("Someone hit the server!");
  res.sendFile(path.join(__dirname, "../public/forum.html"));
});

const aDCLArr = [
  "Common Air Denisty - Sea Level: 0.0764, 5280ft: 0.0627 <br> Lift Coefficients:",
];

app.get("/api/liftCoefficient", (req, res) => {
  rollbar.info("Someone got all the Lift Coefficients");
  res.status(200).send(aDCLArr);
});

app.post("/api/liftCoefficient", (req, res) => {
  const { liftForce, surfaceArea, flowSpeed, airDensity } = req.body;
  let l = liftForce;
  let a = surfaceArea;
  let v = flowSpeed;
  let p = airDensity;
  let answer = l / (p * (v * v) * (a / 2));
  aDCLArr.push(answer);

  res.status(200).send(aDCLArr);
});

app.delete("/api/liftCoefficient/:idx", (req, res) => {
  if (req.params.idx === "0") {
    rollbar.error("Someone tried to delete Air Densitys!");
    return res.status(403).send(aDCLArr);
  }
  rollbar.info(`Someone deleted Lift Coefficient ${aDCLArr[+req.params.idx]}`);
  aDCLArr.splice(+req.params.idx, 1);

  res.status(200).send(aDCLArr);
});

const forumArr = [];

app.get("/api/forum", (req, res) => {
  rollbar.info("Someone got all the forum posts!");
  res.status(200).send(forumArr);
});

app.post("/api/forum", (req, res) => {
  let { title, post } = req.body;
  const ttle = title;
  const pst = post;
  const forumPost = `${ttle}: <br> ${pst}`;
  forumArr.unshift(forumPost);

  res.status(200).send(forumArr);
});

app.delete("/api/forum/:idx", (req, res) => {
  if (req.params.idx <= "2") {
    rollbar.error("Forum posts are getting low!");
    return res.status(403).send(forumArr);
  }
  rollbar.info(`Someone deleted forum post ${forumArr[+req.params.idx]}`);
  forumArr.splice(+req.params.idx, 1);

  res.status(200).send(forumArr);
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => console.log(`Lift off on ${port}!`));
