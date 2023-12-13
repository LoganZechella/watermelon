
document.addEventListener('DOMContentLoaded', function () {
    const companies = ["starbucks", "mcdonalds", "disney", "wendys", "sodastream", "cocacola", "pepsi", "sabra"];

    function updateTile(company, data) {
        console.log(`Data for ${company}:`, data); // For debugging
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
            <p>Current Price: $${data.current_price}</p>
            <p>Price on Oct 6, 2023: $${data.historical_price}</p>
            <p>Price Difference: $${data.price_difference}</p>
        `;

        loadingIndicator.style.display = 'none';
    }

    function fetchData(company) {
        fetch(`http://localhost:5000/stock_data/${company}`)
            .then(response => response.json())
            .then(data => updateTile(company, data))
            .catch(error => {
                const tile = document.getElementById(company);
                tile.querySelector('.error').textContent = 'Failed to load data';
                tile.querySelector('.loading').style.display = 'none';
            });
    }

    companies.forEach(company => {
        fetchData(company);
    });
});