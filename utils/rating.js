const fs = require('fs');
var path = require('path');

const contentsSpots = fs.readFileSync(process.cwd() + "/data/spots.json");
const spots = JSON.parse(contentsSpots);
function ratingFunction(spot) {
    let ratingArray = []

    if (fs.existsSync(process.cwd() + `/data/spots/${spot}Data.json`)) {
        let readData = fs.readFileSync(process.cwd() + `/data/spots/${spot}Data.json`)
        let data = JSON.parse(readData)
        let hour = 12
        console.log(`\n${spot}`)
        //Wind
        let actualAngleW = data.hours[hour].windDirection.sg
        console.log("actualAngleW: " + actualAngleW)
        let bestAngleW = spots[spot].spotOrientation.windBest
        console.log("bestAngleW: " + bestAngleW)
        let rateWind = ratingSystem(actualAngleW, bestAngleW)
        console.log("rateWind: " + rateWind)
        //Swell
        let actualAngleS = data.hours[hour].swellDirection.sg
        console.log("actualAngleS: " + actualAngleS)
        let bestAngleS = spots[spot].spotOrientation.swellBest
        console.log("bestAngleS: " + bestAngleS)
        let rateSwell = ratingSystem(actualAngleS, bestAngleS)
        console.log("rateSwell: " + rateSwell)
        //Result
        let rateResult = ((rateWind + rateSwell) / 2).toFixed(1)
        console.log("rate: " + rateResult)
        return rateResult

    }
    else {
        console.log("No existe")
        return null
    }


}

function rateAllSpots() {
    for (let x in spots) {
        ratingFunction(x)
        ratingArray.push({ name: spot, value: rateResult })
    }
}

function top() {
    let ratingArray = rateAllSpots()
    ratingArray.sort((a, b) => { return b.value - a.value });
}

// console.log(`${ratingArray[0].name}: ${ratingArray[0].value}/10
// ${ratingArray[1].name}: ${ratingArray[1].value}/10
// ${ratingArray[2].name}: ${ratingArray[2].value}/10`)




function ratingSystem(actualAngle, bestAngle) {
    let difference = 180 - Math.abs(Math.abs(actualAngle - bestAngle) - 180);
    let rate = (10 - ((1 / 18) * difference))
    return rate
}

// function angleMath(event) {
//     let aaPath = `data.hours[hour].${event}Direction.sg`
//     let actualAngle = aaPath
//     console.log(actualAngle)
//     let baPath = `spots[x].spotOrientation.${event}Best`
//     let bestAngle = baPath
//     let difference = 180 - Math.abs(Math.abs(actualAngle - bestAngle) - 180);
//     let rate = (10 - ((1 / 18) * difference)).toFixed(1)
//     console.log(rate)
// }

