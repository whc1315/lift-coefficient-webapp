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

const forumArr = [
  "PRINCIPLES OF FLIGHT IN ACTION <br> This is a great article! A Boeing 747 is flying at an altitude of 12,192 meters and has a velocity of 265.5 m/s. The aircraft has a wing area of 510.97 m2. The coefficient of lift is 0.52 and the density is of air at 12,192 meters is approximately 0.30267 kg/m3. The weight of the 747 is 2,833,500 N (637,000 pounds). <br> https://www.google.com/search?q=what+is+the+lift+coefficient+of+a+boeing+747&rlz=1C5CHFA_enUS956US967&sxsrf=APq-WBuecvZbYs7zx1lLcKACCEIKH9FHdQ%3A1645561306806&ei=2kUVYr3hMPrQkPIPqpmVuAY&oq=what+is+the+lift+coefficient&gs_lcp=Cgdnd3Mtd2l6EAMYBTIFCAAQgAQyBggAEAcQHjIGCAAQBxAeMgYIABAHEB4yBQgAEIAEMgQIABAeMgYIABAIEB4yBggAEAgQHjIGCAAQCBAeMgYIABAIEB46BwgjELADECc6BwgAEEcQsAM6BwgjELACECc6BAgAEA06BAgjECc6CAgAEAgQBxAeOgYIABANEB46BQgAEIYDSgQIQRgASgQIRhgAUPMeWJYzYNRaaAFwAHgAgAGFAYgBlgqSAQMzLjmYAQCgAQHIAQrAAQE&sclient=gws-wiz",
  "THIS IS A WEBSITE I REALLY ENJOY <br>  This is a website with a bunch of different articles posted regullarly! I always love reading these articles! <br> https://spectrum.ieee.org/topic/aerospace/#toggle-gdpr <br>",
];

app.get("/api/forum", (req, res) => {
  rollbar.info("Someone got all the forum posts!");
  res.status(200).send(forumArr);
});

app.post("/api/forum", (req, res) => {
  let { title, post, url } = req.body;
  const ttle = title;
  const pst = post;
  const uRL = url;
  const forumPost = `${ttle.toUpperCase()} <br> ${pst} <br> ${uRL}<br>`;
  forumArr.unshift(forumPost);

  res.status(200).send(forumArr);
});

app.delete("/api/forum/:idx", (req, res) => {
  if (req.params.idx <= "1") {
    rollbar.error("Forum posts are getting low!");
    return res.status(403).send(forumArr);
  }
  rollbar.info(`Someone deleted forum post ${forumArr[+req.params.idx]}`);
  forumArr.splice(+req.params.idx, 1);

  res.status(200).send(forumArr);
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => console.log(`Lift off on ${port}!`));
