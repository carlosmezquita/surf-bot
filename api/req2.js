var startTime, endTime;
const path = require("path");
const fetch = require("node-fetch");
const date = require("../utils/date.js");
require('dotenv').config()

function startTimer() {
  startTime = new Date();
};
function endTimer() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}
startTimer()
const fs = require('fs');

// const lat = 43.3729;
// const lng = -8.4056;

// #TO-DO revisar si usar swell o wave!!

const params = 'waveHeight,swellPeriod,swellDirection,windDirection,windSpeed';
const https = require('https');
const xml2js = require('xml2js');
const logger = require("../utils/logger.js");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const UTC = 1

// let start = (((new Date(date) / 1000) - 3600 * UTC))
// let end = start + 86400
// console.log("Fecha inicial en formato UNIX: " + start + "\nFecha final en formato UNIX:" + end)
// console.log("Enlace solicitado:\n" + `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${end}\n`)
let contents = fs.readFileSync(process.cwd() + "/data/spots.json");
// // Define to JSON type
let spotsData = JSON.parse(contents);

function isDataUpdated(spot) {
  if (!fs.existsSync(process.cwd() + `/data/spots/${spot}Data.json`)) { return false }
  logger.debug(`${spot} data file exists`)
  const data = JSON.parse(fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`))
  const fileDate = new Date(data.meta.start) / 1000;
  const todayDate = date.getDay() / 1000;
  if ((todayDate - fileDate) > (22 * 3600)) {
    logger.debug(`${spot} data isn't updated`)
    return false
  } else {
    logger.debug(`${spot} data is updated`)
    return true
  }
}

async function checkFile(spot) {
  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  if (fs.existsSync(process.cwd() + `/data/spots/${spot}Data.json`)) {
    const content = fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`)
    const data = JSON.parse(content)
    let fileDate = new Date(data.meta.end) / 1000
    // console.log(fileDate)
    let nowDate = new Date(date) / 1000
    // console.log(nowDate)
    if (fileDate >= nowDate) {
      logger.debug(`${spot} updated`)
      return content
    }
    else {
      logger.debug(`${spot} isn't updated`)
      return dataRequest(spot)
    }
  }
  else {
    logger.debug(`${spot} does not exist`)
    return dataRequest(spot)
  }
}
async function dataRequest(spot) {
  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  console.log(date);
  let start = ((new Date(date) / 1000))
  console.log(start)
  let end = start + 86400
  let lat = spotsData[spot].latitude
  let lng = spotsData[spot].longitude

  await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${end}`, {
    headers: {
      'Authorization': process.env.SG_KEY
    }
    // Importante añadir error handling!!
  }).then((response) => response.json()).then((jsonData) => {
    res = JSON.stringify(jsonData)
    fs.writeFileSync(process.cwd() + `/data/spots/${spot}Data.json`, res);

    // console.log(data)
  }).then(() => {
    logger.info(`Wave and wind data downloaded successfully for ${spot}`)
  })
  return res
}
// dataRequest(`orzan`)
module.exports = { dataRequest, checkFile, isDataUpdated };
endTimer()
