const fs = require('fs')
const { MessageMedia } = require('whatsapp-web.js');
const loadData = require(process.cwd() + "/api/req2");
const card = require(process.cwd() + '/utils/forecast')


module.exports = {
    name: 'forecast',
    args: true,
    usage: '<lugar>\n',
    description: '',
    aliases: ['pronostico', 'fc'],
    execute(client, msg, args) {
        const removeAccents = (str) => {
            return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        let spot = removeAccents(args)
        let contents = fs.readFileSync(process.cwd() + "/data/spots.json");
        // // Define to JSON type
        let spotsData = JSON.parse(contents);
        if (spotsData[spot]) {
            async function sendForecast(spot) {
                await card.cardGenerator(spot);
                let date = await card.getDate(spot);
                let media = MessageMedia.fromFilePath(process.cwd() + `/data/spots/${spot}Card.jpeg`);
                let webcamMsg = spotsData[spot].webcam ? "\n```Webcam: " + spotsData[spot].webcam + "```" : ``;
                client.sendMessage(msg.from, media, { caption: `*${spotsData[spot].name}* _(${date})_${webcamMsg}` })
            };
            sendForecast(spot)
        }
        else {
            client.sendMessage(msg.from, args + " no se encuentra registrado.")
            client.sendMessage(msg.from, "Escriba ```!spots``` para ver la lista de lugares.")
        }
    },
};