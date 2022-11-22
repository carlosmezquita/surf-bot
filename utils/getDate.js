let today = new Date();
let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
exports.date = date;
console.log(date);
