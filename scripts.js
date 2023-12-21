function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;  // getMonth() returns month from 0-11
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); // get last two digits of year
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
};

var burger = document.querySelector('.burger-container');
var header = document.querySelector('.menu-container');
const menuContainer = document.querySelector('.menu-container');
var mapsDiv = document.getElementById("map");

burger.addEventListener('click', function () {
    header.classList.toggle('menu-opened');
});

function menuMapToggle() {
    menuContainer.classList.toggle('menu-opened');
    if (!menuContainer.classList.contains('menu-opened')) {
        dashboardDiv.style.display = "none";
        mapsDiv.style.display = "flex";
    } else {
        setTimeout(menuLoginToggle, 800);
    }
};

function menuDashToggle() {
    menuContainer.classList.toggle('menu-opened');
    if (!menuContainer.classList.contains('menu-opened')) {
        dashboardDiv.style.display = "flex";
        mapsDiv.style.display = "none";
    } else {
        setTimeout(menuLoginToggle, 800);
    }
};

// Go to Maps (Dropdown Menu)

var mapsBtn = document.getElementById("maps-btn");
var dashboardDiv = document.getElementById("dashboard");

mapsBtn.addEventListener('click', function () {
    menuMapToggle();
});

// Go to Dashboard (Dropdown Menu)

var dashBtn = document.getElementById("dash-btn");
var dashboardDiv = document.getElementById("dashboard");

dashBtn.addEventListener('click', function () {
    menuDashToggle();
});

// Main Dashboard and Maps Buttons

document.getElementById('dashboard-btn').addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    document.querySelector('.dashboard').style.display = 'flex';
});

document.getElementById('mainMaps-btn').addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    document.querySelector('.map').style.display = 'flex';
});


// Dashboard Content Pull

document.addEventListener('DOMContentLoaded', async function () {
    const companies = ["starbucks", "mcdonalds", "disney", "cocacola", "pepsi", "sabra"];

    async function updateTile(company, data) {
        const tile = document.getElementById(company);
        const loadingIndicator = tile.querySelector('.loading');
        const errorIndicator = tile.querySelector('.error');

        if (data.error) {
            errorIndicator.textContent = 'Error: ' + data.error;
            loadingIndicator.style.display = 'none';
            return;
        }

        tile.innerHTML += `
            <h2>${data.company_name}</h2>
            <p>Current Price: ${data.current_price}</p>
            <p>Historical Price (Oct 6, 2023): ${data.historical_price}</p>
            <p>Price Difference: ${data.price_difference}</p>
            <p>Market Cap (Oct 6, 2023): ${data.market_cap}</p>
        `;

        loadingIndicator.style.display = 'none';
    }

    async function fetchData(company) {
        const storedItem = localStorage.getItem(`stockData_${company}`);
        let data;

        if (storedItem) {
            console.log(`Data for ${company} already loaded`);
            data = JSON.parse(storedItem).data;
            updateTile(company, data);
            document.getElementById(company).querySelector('.loading').style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`https://vast-castle-08505-c3727fd0181a.herokuapp.com/stock_data/${company}`);
            data = await response.json();
            localStorage.setItem(`stockData_${company}`, JSON.stringify({ data, lastUpdated: new Date().toDateString() }));
            updateTile(company, data);
            document.getElementById(company).querySelector('.loading').style.display = 'none';
            console.log(`Data for ${company}:`, data); // For debugging
        } catch (error) {
            const tile = document.getElementById(company);
            tile.querySelector('.error').textContent = 'Failed to load data';
            tile.querySelector('.loading').style.display = 'none';
        }
    }

    async function renderChart(company) {
        const today = new Date().toDateString();
        const storedItem = localStorage.getItem(`stockData_${company}`);
        let data, lastUpdated;

        if (storedItem) {
            const storedData = JSON.parse(storedItem);
            lastUpdated = storedData.lastUpdated;
            data = storedData.data;

            if (lastUpdated !== today || !data.graph) {
                data = null; // Fetch new data if not today's or no graph data
            }
        }

        if (!data) {
            try {
                const response = await fetch(`https://vast-castle-08505-c3727fd0181a.herokuapp.com/stock_data/${company}`);
                const fetchedData = await response.json();
                if (fetchedData && fetchedData.graph) {
                    data = fetchedData;
                    localStorage.setItem(`stockData_${company}`, JSON.stringify({ data, lastUpdated: today }));
                } else {
                    throw new Error('Invalid data format from API');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                return;
            }
        }

        if (data && data.graph) {
            const chartId = `stockChart${companies.indexOf(company) + 1}`;
            const ctx = document.getElementById(chartId).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.graph.map(item => formatDate(item.date)),
                    datasets: [{
                        label: `${company} Stock Price`,
                        data: data.graph.map(item => item.price),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function (value, index, values) {
                                    return '$' + value.toFixed(2);  // Format as USD
                                }
                            }
                        },
                        x: {
                            
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            display: false
                        }
                    },
                    responsive: true
                }
            });
        } else {
            console.error(`No graph data available for ${company}`);
        }
    }

    for (const company of companies) {
        await fetchData(company);
        await renderChart(company);
    }
});
