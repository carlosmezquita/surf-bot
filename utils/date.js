// let today = new Date();
// let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
// exports.date = date;
// console.log(date);

function getDay() {
    let today = new Date()
    todayDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, -today.getTimezoneOffset());
    return todayDate
}

module.exports = { getDay }