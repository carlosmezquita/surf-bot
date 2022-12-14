const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs');
const date = require('./date')
const req = require('../api/req2')

const loadHTML = require("./htmlGenerator");
const logger = require('./logger');

const todayDate = date.getDay()


async function getDate(spot) {
    const file = fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`);
    let data = JSON.parse(file)
    let rawDate = new Date(data.meta.end)
    let date = rawDate.getDate() + '/' + (rawDate.getMonth() + 1) + '/' + rawDate.getFullYear();
    return date;
}

async function checkImageDate(spot) {
    let file;
    if (req.isDataUpdated(spot) === false || fs.existsSync(process.cwd() + `/data/spots/${spot}Card.jpeg`) === false) {
        const weatherData = await req.checkFile(spot)
        return cardGenerator(spot, weatherData)
    }

    file = fs.readFileSync(process.cwd() + `/data/forecastDate.json`)
    data = JSON.parse(file)
    const weatherData = fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`)
    const todayDate = date.getDay()
    if (data[spot] == undefined || new Date(data[spot].imgTime) < todayDate) {

        return cardGenerator(spot, weatherData)
    } else {
        logger.debug(`The image for ${spot} is updated as ${data[spot].imgTime}`)
        return process.cwd() + `/data/spots/${spot}Card.jpeg`
    }

}


async function cardGenerator(spot, weather) {
    const outputPath = process.cwd() + `/data/spots/${spot}Card.jpeg`
    logger.debug(`Creating new image for ${spot}`)
    await nodeHtmlToImage({
        output: outputPath,
        html: await loadHTML.loadCard(spot, weather)

    })

        .then(() => {
            logger.info(`Image succesfully created for ${spot}`)

        })

    file = fs.readFileSync(process.cwd() + `/data/forecastDate.json`)
    data = JSON.parse(file)
    data[spot] = { imgTime: todayDate.toJSON() }
    fs.writeFileSync(process.cwd() + `/data/forecastDate.json`, JSON.stringify(data, null, 4))
    return outputPath
}
checkImageDate("orzan")

module.exports = { cardGenerator, getDate, checkImageDate };

