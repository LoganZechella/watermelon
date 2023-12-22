function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;  // getMonth() returns month from 0-11
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); // get last two digits of year
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
};


// Animations

const animateCSS = (element, animation, duration = '0.5s', delay = '0.5s', prefix = 'animate__') =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.getElementById(element);

        // Set the duration and delay of the animation using style.setProperty
        node.style.setProperty('--animate-duration', duration);
        node.style.setProperty('--animate-delay', delay);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            node.style.removeProperty('--animate-duration');
            node.style.removeProperty('--animate-delay');
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });



// Burger Menu    
var burger = document.querySelector('.burger-container');
var header = document.querySelector('.menu-container');
const menuContainer = document.querySelector('.menu-container');
var mainDiv = document.getElementById("main");
var mapsDiv = document.getElementById("maps");
var dashboardDiv = document.getElementById("dashboard");

burger.addEventListener('click', function () {
    header.classList.toggle('menu-opened');
});

function menuMapToggle() {
    menuContainer.classList.toggle('menu-opened');
    document.getElementById('wwii-map-btn').classList.toggle('animate__animated');
    document.getElementById('wwii-map-btn').classList.toggle('animate__bounceOut');
    document.getElementById('marine-map-btn').classList.toggle('animate__animated');
    document.getElementById('marine-map-btn').classList.toggle('animate__bounceOut');
    animateCSS('maps', 'fadeOut', '1000ms', '0ms');
    if (!menuContainer.classList.contains('menu-opened')) {
        setTimeout(function () {
            animateCSS('wwii-map-btn', 'bounceIn', '800ms', '800ms');
            animateCSS('marine-map-btn', 'bounceIn', '800ms', '800ms');
            mapsDiv.style.display = "none";
            dashboardDiv.style.display = "none";
            document.getElementById('main').style.display = 'flex';
            document.getElementById('buttons-map-select').style.display = 'flex';
        }, 800);
    } else {
        setTimeout(menuMapToggle, 800);
    }
};

function menuDashToggle() {
    menuContainer.classList.toggle('menu-opened');
    if (!menuContainer.classList.contains('menu-opened')) {
        dashboardDiv.style.display = "flex";
        mainDiv.style.display = "none";
        mapsDiv.style.display = "none";

    } else {
        setTimeout(menuDashToggle, 800);
    }
};

// document.getElementById('h1').addEventListener('click', function () {
//     dashboardDiv.style.display = "none";
//     mainDiv.style.display = "flex";
//     mapsDiv.style.display = "none";
// });

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
    animateCSS('mainMaps-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('mainDash-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('main', 'fadeOut', '1000ms', '1000ms');
    setTimeout(function () {
        animateCSS('dashboard', 'fadeIn', '1000ms', '100ms')
        document.querySelector('.main').style.display = 'none';
        document.querySelector('.dashboard').style.display = 'flex';
    }, 1000);
});

document.getElementById('mainMaps-btn').addEventListener('click', function () {
    animateCSS('mainMaps-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('dashboard-btn', 'bounceOut', '1000ms', '0ms');
    setTimeout(function () {
        document.querySelector('.buttons').style.display = 'none';
        animateCSS('wwii-map-btn', 'bounceIn', '1000ms', '0ms');
        animateCSS('marine-map-btn', 'bounceIn', '1000ms', '0ms');
        document.getElementById('buttons-map-select').style.display = 'flex';
    }, 600);
});

document.getElementById('wwii-map-btn').addEventListener('click', function () {
    animateCSS('wwii-map-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('marine-map-btn', 'bounceOut', '1000ms', '0ms');
    // animateCSS('buttons-map-select', 'bounceOut', '1000ms', '0ms');
    setTimeout(function () {
        animateCSS('maps', 'fadeIn', '1000ms', '100ms')
        document.getElementById('maps').style.display = 'flex';
        document.getElementById('marine-map').style.display = 'none';
        document.getElementById('wwii-map').style.display = 'flex';
        document.getElementById('main').style.display = 'none';
    }, 1000);
    document.getElementById('wwii-map-btn').classList.toggle('animate__bounceOut');
    document.getElementById('marine-map-btn').classList.toggle('animate__bounceOut');
});

document.getElementById('marine-map-btn').addEventListener('click', function () {
    animateCSS('wwii-map-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('marine-map-btn', 'bounceOut', '1000ms', '0ms');
    // animateCSS('buttons-map-select', 'bounceIn', '1000ms', '0ms');
    setTimeout(function () {
        animateCSS('maps', 'fadeIn', '1000ms', '100ms')
        document.querySelector('.maps').style.display = 'flex';
        document.getElementById('marine-map').style.display = 'flex';
        document.getElementById('wwii-map').style.display = 'none';
        document.querySelector('.main').style.display = 'none';
        document.getElementById('wwii-map-btn').classList.toggle('animate__bounceOut');
        document.getElementById('marine-map-btn').classList.toggle('animate__bounceOut');
    }, 1000);
    
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
