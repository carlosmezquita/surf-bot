const client = require(process.cwd() + '/twitterbot/twitterClient.js')
const fs = require('fs');
const { Module } = require('module');
const card = require(process.cwd() + '/utils/forecast')

async function forecast(spot) {
    try {
        const contents = fs.readFileSync(process.cwd() + "/data/spots.json");
        // // Define to JSON type
        const spotsData = JSON.parse(contents);

        let date = await card.getDate(spot);

        const imgPath = await card.checkImageDate(spot)
        const picID = await client.v1.uploadMedia(imgPath);

        // mediaIds is a string[], can be given to .tweet
        await client.v1.tweet(`📍 ${spotsData[spot].name}\n🗓️ ${date}`, { media_ids: picID });

        console.log("Tweet published successfully!");
    } catch (e) {
        console.error(e);
    }
}
module.exports = { forecast };
// forecast("malpica");
