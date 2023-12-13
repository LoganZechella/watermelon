// script.js
document.addEventListener('DOMContentLoaded', function () {
    const companies = ["starbucks", "mcdonalds", "disney", "wendys", "sodastream", "cocacola", "pepsi", "sabra"];

    companies.forEach(company => {
        fetch(`http://localhost:5000/stock_data/${company}`)
            .then(response => response.json())
            .then(data => updateTile(company, data))
            .catch(error => console.error('Error:', error));
    });
});

function updateTile(company, data) {
    const tile = document.getElementById(company);
    tile.innerHTML = `
        <h2>${data.company_name}</h2>
        <p>Current Price: $${data.current_price}</p>
        <p>Price on Oct 6, 2023: $${data.historical_price}</p>
        <p>Price Difference: $${data.price_difference}</p>
    `;
}
