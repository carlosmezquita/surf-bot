const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs');

const loadHTML = require("./htmlGenerator")

async function getDate(spot) {
    const file = fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`);
    let data = JSON.parse(file)
    let rawDate = new Date(data.meta.end)
    let date = rawDate.getDate() + '/' + (rawDate.getMonth() + 1) + '/' + rawDate.getFullYear();
    return date;
}

async function cardGenerator(spot) {
    const outputPath = process.cwd() + `/data/spots/${spot}Card.jpeg`
    await nodeHtmlToImage({
        output: outputPath,
        html: await loadHTML.loadCard(spot)

    })

        .then(() => {
            console.log('The image was created successfully!')
        })
}

module.exports = { cardGenerator, getDate };

