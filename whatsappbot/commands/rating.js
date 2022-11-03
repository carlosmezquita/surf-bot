const fs = require('fs');
const rating = require(process.cwd() + '/utils/rating')

module.exports = {
    name: 'rating',
    aliases: ['valoracion', 'nota', 'comando_secreto'],
    description: 'Rates a forecast',
    args: false,
    usage: "",
    execute(client, msg, args, date) {
        try {
            const fs = require('fs');
            var path = require('path');

            const contentsSpots = fs.readFileSync(process.cwd() + "/data/spots.json");
            const spots = JSON.parse(contentsSpots);
            function ratingFunction() {
                let ratingArray = []
                for (let x in spots) {

                    if (fs.existsSync(process.cwd() + `/data/spots/${x}Data.json`)) {
                        let readData = fs.readFileSync(process.cwd() + `/data/spots/${x}Data.json`)
                        let data = JSON.parse(readData)
                        let hour = 14
                        console.log(`\n${x}`)
                        //Wind
                        let actualAngleW = data.hours[hour].windDirection.sg
                        console.log("actualAngleW: " + actualAngleW)
                        let bestAngleW = spots[x].spotOrientation.windBest
                        console.log("bestAngleW: " + bestAngleW)
                        let rateWind = ratingSystem(actualAngleW, bestAngleW)
                        console.log("rateWind: " + rateWind)
                        //Swell
                        let actualAngleS = data.hours[hour].swellDirection.sg
                        console.log("actualAngleS: " + actualAngleS)
                        let bestAngleS = spots[x].spotOrientation.swellBest
                        console.log("bestAngleS: " + bestAngleS)
                        let rateSwell = ratingSystem(actualAngleS, bestAngleS)
                        console.log("rateSwell: " + rateSwell)
                        //
                        let rateResult = ((rateWind + rateSwell) / 2).toFixed(1)
                        console.log("rate: " + rateResult)
                        ratingArray.push({ name: x, value: rateResult })

                    }
                    else {
                        console.log("No existe")
                    }
                }
                return ratingArray
            }


            let ratingArray = ratingFunction()
            ratingArray.sort((a, b) => { return b.value - a.value });

            client.sendMessage(msg.from, `${ratingArray[0].name}: ${ratingArray[0].value}/10\n${ratingArray[1].name}: ${ratingArray[1].value}/10\n${ratingArray[2].name}: ${ratingArray[2].value}/10`)




            function ratingSystem(actualAngle, bestAngle) {
                let difference = 180 - Math.abs(Math.abs(actualAngle - bestAngle) - 180);
                let rate = (10 - ((1 / 18) * difference))
                return rate
            }
        } catch (error) {
            console.error(error);
            msg.reply(`There was an error while rating`);
        }
    },
};