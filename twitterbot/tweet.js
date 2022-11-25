const client = require(process.cwd() + '/twitterbot/twitterClient.js')
const fs = require('fs');
const { Module } = require('module');
const card = require(process.cwd() + '/utils/forecast')

async function forecast(spot) {
    try {
        const contents = fs.readFileSync(process.cwd() + "/data/spots.json");
        // // Define to JSON type
        const spotsData = JSON.parse(contents);

        let today = new Date();
        let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

        const picID = await client.v1.uploadMedia(await card.checkImageDate(spot));

        // mediaIds is a string[], can be given to .tweet
        await client.v1.tweet(`📍 ${spotsData[spot].name}\n🗓️ ${date}`, { media_ids: picID });

        console.log("Tweet published successfully!");
    } catch (e) {
        console.error(e);
    }
}
module.exports = { forecast };
// forecast("orzan");
