require('dotenv').config()
const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: TW_APP_KEY,
    appSecret: TW_APP_SECRET,
    accessToken: TW_ACCESS_TOKEN,
    accessSecret: TW_ACCESS_SECRET
})

const rwClient = client.readWrite

module.exports = rwClient