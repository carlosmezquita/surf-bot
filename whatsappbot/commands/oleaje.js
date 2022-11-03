const fs = require('fs');
const { send } = require('process');
const loadData = require(process.cwd() + "/api/req2");
module.exports = {
    name: 'oleaje',
    args: true,
    usage: '<lugar>',
    aliases: ['olas', 'swell', 'waves'],
    description: 'Información sobre el oleaje.',
    execute(client, mdwd, args) {
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

                function energyF(num) {
                    return Math.round((((1025 * (9.81 ** 2) / 64 * Math.PI) * (data.hours[num].waveHeight.dwd) ** 2) * data.hours[num].swellPeriod.dwd) / 1000);
                }
                try {
                    let fileDate = new Date(data.meta.end)
                    let date = fileDate.getDate() + "/" + (fileDate.getMonth() + 1) + "/" + fileDate.getFullYear();
                    client.sendMessage(mdwd.from, "🌊 *El pronóstico de hoy es:* " +
                        "\n\n*08:00*     " + data.hours[8].waveHeight.dwd + "m      " + data.hours[8].swellPeriod.dwd + "s     " + energyF(8) + "kJ" +
                        "\n\n*10:00*     " + data.hours[10].waveHeight.dwd + "m      " + data.hours[10].swellPeriod.dwd + "s     " + energyF(10) + "kJ" +
                        "\n\n*12:00*     " + data.hours[12].waveHeight.dwd + "m      " + data.hours[12].swellPeriod.dwd + "s     " + energyF(12) + "kJ" +
                        "\n\n*14:00*     " + data.hours[14].waveHeight.dwd + "m      " + data.hours[14].swellPeriod.dwd + "s     " + energyF(14) + "kJ" +
                        "\n\n*16:00*     " + data.hours[16].waveHeight.dwd + "m      " + data.hours[16].swellPeriod.dwd + "s     " + energyF(16) + "kJ" +
                        "\n\n*18:00*     " + data.hours[18].waveHeight.dwd + "m       " + data.hours[18].swellPeriod.dwd + "s     " + energyF(18) + "kJ" +
                        "\n\n*20:00*     " + data.hours[20].waveHeight.dwd + "m      " + data.hours[20].swellPeriod.dwd + "s     " + energyF(20) + "kJ" +
                        "\n\n*22:00*     " + data.hours[22].waveHeight.dwd + "m      " + data.hours[22].swellPeriod.dwd + "s     " + energyF(22) + "kJ" +
                        "\n\n_🏖 " + spotsData[spot].name + "    🗓️ " + date + "_")
                }
                catch (error) {
                    console.error(error)
                    client.sendMessage(mdwd.from, `Se produjo un error al obtener el pronóstico. Por favor inténtelo de nuevo más tarde.`)
                }
            }
            sendForecast(spot)
        }

        else {
            client.sendMessage(mdwd.from, args + " no se encuentra registrado.")
            client.sendMessage(mdwd.from, "Escriba ```!spots``` para ver la lista de lugares.")
        }
    },
};