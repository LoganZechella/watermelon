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
    // document.getElementById('wwii-map-btn').classList.toggle('animate__animated');
    // document.getElementById('wwii-map-btn').classList.toggle('animate__bounceOut');
    // document.getElementById('marine-map-btn').classList.toggle('animate__animated');
    // document.getElementById('marine-map-btn').classList.toggle('animate__bounceOut');
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

// Chart Select Buttons

document.getElementById('defense-47-24-btn').addEventListener('click', function () {
    animateCSS('defense-47-24-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('healthcare-90-28-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('charts', 'fadeIn', '1500ms', '0ms');
    setTimeout(function () {
        document.getElementById('defense-47-24').style.display = 'flex';
        document.getElementById('healthcare-90-28').style.display = 'none';
        document.getElementById('charts').style.display = 'flex';
        document.getElementById('back-btn-div').style.display = 'block';
        document.getElementById('buttons-chart-select').style.display = 'none';
        document.getElementById('main').style.display = 'none';
    }, 500);
    setTimeout(() => {
        document.getElementById('defense-47-24').style.display = 'flex';
    }, 3000);
});

document.getElementById('healthcare-90-28-btn').addEventListener('click', function () {
    animateCSS('defense-47-24-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('healthcare-90-28-btn', 'bounceOut', '1000ms', '0ms');
    animateCSS('charts', 'fadeIn', '1500ms', '0ms');
    setTimeout(function () {
        document.getElementById('healthcare-90-28').style.display = 'flex';
        document.getElementById('defense-47-24').style.display = 'none';
        document.getElementById('charts').style.display = 'flex';
        document.getElementById('back-btn-div').style.display = 'block';
        document.getElementById('buttons-chart-select').style.display = 'none';
        document.getElementById('main').style.display = 'none';
    }, 500);
    setTimeout(() => {
        document.getElementById('healthcare-90-28').style.display = 'flex';
    }, 3000);
});

document.getElementById('back-btn').addEventListener('click', function () {
    var chartsDiv = document.getElementById('charts');
    var chartSelectDiv = document.getElementById('main');
    var chartSelectBtns = document.getElementById('buttons-chart-select');
    // Toggle visibility of chart selection and charts
    if (chartsDiv.style.display === 'none') {
        chartsDiv.style.display = 'flex';
        chartSelectDiv.style.display = 'none';
        chartSelectBtns.style.display = 'flex';
    } else {
        chartsDiv.style.display = 'none';
        chartSelectDiv.style.display = 'flex';
        chartSelectBtns.style.display = 'flex';
    }
});

document.getElementById('home-btn-link').addEventListener('click', function () {
    window.location.href = 'index.html';
});

