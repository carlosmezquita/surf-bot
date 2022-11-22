var startTime, endTime;

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
const fetch = require("node-fetch");
const lat = 43.3729;
const lng = -8.4056;
const params = 'waveHeight,swellPeriod,windDirection,windSpeed';
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });


let today = new Date();

let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
console.log("Fecha de hoy:" + date);

let start = (new Date(date) / 1000)
let end = start + 86400
console.log("Fecha inicial en formato UNIX: " + start + "\nFecha final en formato UNIX:" + end)
console.log("Enlace solicitado:\n" + `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${end}\n`)

function dataRequest() {
  let req = https.get("https://servizos.meteogalicia.gal/rss/predicion/rssMareas.action?request_locale=es", function (res) {
    let data = '';
    res.on('data', function (stream) {
      data += stream;
    });
    res.on('end', function () {
      parser.parseString(data, function (error, result) {
        if (error === null) {
          console.log(result);
          const data = JSON.stringify(result, null, 4);
          // console.log(data)
          console.log("Tides downloaded succesfully!")
          fs.writeFileSync(process.cwd() + '/data/tides.json', data);

        }
        else {
          console.log(error);
        }
      });
    });
  });
  fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${end}`, {
    headers: {
      'Authorization': process.env.SG_KEY
    }
    // Importante añadir error handling!!
  }).then((response) => response.json()).then((jsonData) => {
    let data = JSON.stringify(jsonData)
    fs.writeFileSync('./data/waveData.json', data);
    // console.log(data)
    console.log("Wave and wind data downloaded succesfully")
  });
}

dataRequest()
module.exports = { dataRequest };
endTimer()
