const fs = require('fs')
const loadData = require(process.cwd() + "/api/req2");
module.exports = {
    name: 'viento',
    args: true,
    usage: '<lugar>',
    aliases: ['wind'],
    description: 'Información sobre el viento.',
    execute(client, msg, args) {
        const removeAccents = (str) => {
            return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        const spot = removeAccents(args)
        const contents = fs.readFileSync(process.cwd() + "/data/spots.json");
        // // Define to JSON type
        const spotsData = JSON.parse(contents);
        if (spotsData[spot]) {
            async function sendForecast(spot) {
                let data = JSON.parse(await loadData.checkFile(spot))
                function windArrow(n) {
                    let dg = data.hours[n].windDirection.sg
                    if ((dg >= 0 && dg <= 22.5) || (dg >= 337.5 && dg < 360)) {
                        return '⬇'
                    }
                    else if (dg > 22.5 && dg < 67.5) {
                        return '↙'
                    }
                    else if (dg >= 67.5 && dg < 112.5) {
                        return '⬅'
                    }
                    else if (dg >= 112.5 && dg < 157.5) {
                        return '↖'
                    }
                    else if (dg >= 157.5 && dg < 202.5) {
                        return '⬆'
                    }
                    else if (dg >= 202.5 && dg < 247.5) {
                        return '↗'
                    }
                    else if (dg >= 247.5 && dg < 292.5) {
                        return '➡'
                    }
                    else if (dg >= 292.5 && dg < 337.5) {
                        return '↘'
                    }
                    else {
                        return ''
                    }
                };
                let fileDate = new Date(data.meta.end)
                let date = fileDate.getDate() + "/" + (fileDate.getMonth() + 1) + "/" + fileDate.getFullYear();
                client.sendMessage(msg.from, "💨 *El pronóstico de hoy es:* " +
                    "\n\n*08:00*     " + Math.round((data.hours[8].windSpeed.sg) * 3.6) + "km/h      " + data.hours[8].windDirection.sg + "°     " + windArrow(8) +
                    "\n\n*10:00*     " + Math.round((data.hours[10].windSpeed.sg) * 3.6) + "km/h      " + data.hours[10].windDirection.sg + "°     " + windArrow(10) +
                    "\n\n*12:00*     " + Math.round((data.hours[12].windSpeed.sg) * 3.6) + "km/h      " + data.hours[12].windDirection.sg + "°     " + windArrow(12) +
                    "\n\n*14:00*     " + Math.round((data.hours[14].windSpeed.sg) * 3.6) + "km/h      " + data.hours[14].windDirection.sg + "°     " + windArrow(14) +
                    "\n\n*16:00*     " + Math.round((data.hours[16].windSpeed.sg) * 3.6) + "km/h      " + data.hours[16].windDirection.sg + "°     " + windArrow(16) +
                    "\n\n*18:00*     " + Math.round((data.hours[18].windSpeed.sg) * 3.6) + "km/h      " + data.hours[18].windDirection.sg + "°     " + windArrow(18) +
                    "\n\n*20:00*     " + Math.round((data.hours[20].windSpeed.sg) * 3.6) + "km/h      " + data.hours[20].windDirection.sg + "°     " + windArrow(20) +
                    "\n\n*22:00*     " + Math.round((data.hours[22].windSpeed.sg) * 3.6) + "km/h      " + data.hours[22].windDirection.sg + "°     " + windArrow(22) +
                    "\n\n_🏖 " + spotsData[spot].name + "    🗓️ " + date + "_")
            }
            sendForecast(spot)
        }
        else {
            client.sendMessage(msg.from, `${args} no se encuentra registrado.`)
        }
    }
}