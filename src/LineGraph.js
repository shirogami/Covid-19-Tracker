import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';


const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    label: "Covid",

    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    beginAtZero: true,
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};


const buildChartData = (data, caseType = "cases") => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[caseType][date];
    }

    return chartData;
}

function LineGraph({ caseType = "cases", ...props }) {
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let chartData = buildChartData(data, caseType);
                    setData(chartData);

                });
        }

        fetchData();

    }, [caseType]);


    return (
        <div className={props.className}>
            {data?.length > 0 && (

                <Line

                    data={{
                        datasets: [{
                            label: 'Covid-19',
                            backgroundColor: 'rgba(204, 16, 52, 0.5)',
                            borderColor: "#CC1034",
                            data: data
                        }]
                    }}
                    options={options}
                />

            )}


        </div>
    );
}

export default LineGraph
