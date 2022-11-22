const fs = require('fs');
const parse = require('node-html-parser').parse
const chroma = require('chroma-js');

const loadData = require("../api/req2");
let html = fs.readFileSync(process.cwd() + "/utils/forecast.html").toString();
let root = parse(html)

const docWaveSize = root.querySelectorAll(`#waveSize td`);
const docSwellPeriod = root.querySelectorAll(`#swellPeriod td`);
const docSwellDirection = root.querySelectorAll("#swellDirection svg");
const docWindDirection = root.querySelectorAll("#windDirection svg");
const docWindSpeed = root.querySelectorAll("#windSpeed td");
const docSpotName = root.getElementById("title")
const docMap = root.getElementById("mapImg")

const waveScale = chroma.scale('Spectral').domain([6, 0]).gamma(3).mode('lab');
const windScale = chroma.scale(['lightblue', 'yellow', 'navy']).mode('lch').domain([0, 120]).gamma(0.6);

async function loadCard(spot) {
    const data = JSON.parse(await loadData.checkFile(spot))
    const spotsData = JSON.parse(fs.readFileSync(process.cwd() + "/data/spots.json"));

    docSpotName.set_content(spotsData[spot].name)
    docMap.setAttribute("src", `https://dev.virtualearth.net/REST/V1/Imagery/Map/Aerial/${spotsData[spot].latitude}%2C${spotsData[spot].longitude}/15?mapSize=900,834&format=png&key=${process.env.MAP_KEY}`)

    for (i = 0; i < 8; i++) {


        // By multiplying index (i) by 2 and adding 8 it matches the time showed on the table
        const waveSize = data.hours[i * 2 + 8].waveHeight.dwd
        const wavePeriod = data.hours[i * 2 + 8].swellPeriod.dwd
        const swellDirection = -270 + data.hours[i * 2 + 8].swellDirection.sg
        const windDirection = -270 + data.hours[i * 2 + 8].windDirection.sg
        const windSpeed = (data.hours[i * 2 + 8].windSpeed.sg * 3.6).toFixed(2)

        //get the colors
        const waveColor = waveScale(waveSize);
        const windColor = windScale(windSpeed);

        //Set wave values, both size and period
        docWaveSize[i].set_content(waveSize.toString())
        docSwellPeriod[i].set_content(wavePeriod.toString())
        docSwellDirection[i].setAttribute("style", `transform: rotate(${swellDirection}deg) scale(2.5)`)

        //Set wind values, both speed and direction
        docWindDirection[i].setAttribute("style", `transform: rotate(${windDirection}deg) scale(2.5)`)
        docWindSpeed[i].set_content(windSpeed.toString())

        //If there is a previous color then add a gradient if not just its corresponding background colorr
        if (i > 0) {
            docWaveSize[i].setAttribute("style", `background: linear-gradient(to right, ${prevWaveColor}, ${waveColor})`)
            docWindSpeed[i].setAttribute("style", `background: linear-gradient(to right, ${prevWindColor}, ${windColor})`)
        } else {
            docWaveSize[i].setAttribute("style", `background-color: ${waveColor}`)
            docWindSpeed[i].setAttribute("style", `background-color: ${windScale(windSpeed)}`)
        }
        if (waveColor.luminance() > 0.5) {
            docWaveSize[i].setAttribute("style", `${docWaveSize[i].getAttribute("style")}; color: #000`)
        }
        if (windColor.luminance() > 0.5) {
            docWindSpeed[i].setAttribute("style", `${docWindSpeed[i].getAttribute("style")}; color: #000`)
        }
        //Set the new previous values
        prevWaveColor = waveColor
        prevWindColor = windColor
    }
    return root.toString()
}

//`https://dev.virtualearth.net/REST/V1/Imagery/Map/Aerial/${spotsData[spot].latitude}%2C${spotsData[spot].longitude}/15?mapSize=900,834&format=png&key=${process.env.MAP_KEY}`
// console.log("")
// loadCard("orzan").then(function (value) {
//     fs.writeFile('./test.html', value, function (err) {
//         if (err) return console.log(err);
//         console.log('Done');
//     });
// });




module.exports = { loadCard };

//For waves Spectral