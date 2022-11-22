const Chart = require('chartjs');
// import Chart from 'chart.js/auto';

let now = new Date;
// const ctx = document.getElementById('tideChart');
const string = ""
let date = new Date();
let myChart = new Chart(string, {
    plugins: [ChartDataLabels],
    type: 'line',
    data: {
        // labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
        datasets: [
            {
                borderColor: 'rgb(2, 62, 138)',
                backgroundColor: 'rgb(2, 62, 138)',
                label: "My First dataset",
                data: [{ x: date.setHours(1, 55, 00), y: 1.2 }, { x: date.setHours(8, 1, 0), y: 3.1 }, { x: date.setHours(14, 00, 0), y: 1.3 }, { x: date.setHours(21, 56, 0), y: 3.3 }, { x: date.setHours(24 + 4, 0, 0), y: 1.3 }],

                fill: {
                    target: "start",
                    above: 'rgb(72, 202, 228, 0.2)',   // Area will be red above the origin
                    // below: 'rgb(255, 0, 0, 0.2)'    // And blue below the origin
                },
            }]
    },
    options: {
        animation: false,
        plugins: {
            datalabels: {

                formatter: (val) => {
                    let time = new Date(val.x)
                    return `${time.getHours()}:${String(time.getMinutes()).padStart(2, "0")} (${val.y}m)`
                },
                backgroundColor: function (context) {
                    return context.dataset.borderColor;
                },
                borderRadius: 4,
                color: 'white',
                padding: 6,
                font: {
                    size: 32,
                    weight: 'bold'
                },
                align: 'right',
                anchor: 'center',
                offset: 0,
                clamp: true,
                display: "auto"
                // rotation: 90,
            },
            legend: {
                display: false //This will do the task
            },
            tooltip: {
                // Disable the on-canvas tooltip
                enabled: false
            },
        },
        interaction: {
            intersect: false,
        },
        tension: 0.3,
        scales: {
            x: {

                display: false,
                type: 'time',
                parsing: false,
                time: {
                    unit: "hour",
                    stepSize: 2,
                    displayFormats: {
                        'hour': 'HH:mm',
                        'minute': 'HH:mm'
                    },
                },
                beginAtZero: true,
                min: now.setHours(6, 0),
                max: now.setHours(23, 59)
            },
            y: {
                display: false,
                title: {
                    display: false,
                    text: 'Tide Height (m)'
                },
                ticks: {
                    padding: 10
                }
                // beginAtZero: true,
                // suggestedMin: -3,
                // suggestedMax: 3
            }
        }
    }
});
console.log(string)