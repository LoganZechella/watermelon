
document.addEventListener('DOMContentLoaded', async function () {
    const companies = ["starbucks", "mcdonalds", "disney", "wendys", "sodastream", "cocacola", "pepsi", "sabra"];

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
            <p>Current Price: $${data.current_price}</p>
            <p>Price on Oct 6, 2023: $${data.historical_price}</p>
            <p>Price Difference: $${data.price_difference}</p>
        `;

        loadingIndicator.style.display = 'none';
    }

    async function fetchData(company) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/stock_data/${company}`);
            const data = await response.json();
            await updateTile(company, data);
            console.log(`Data for ${company}:`, data); // For debugging
        } catch (error) {
            const tile = document.getElementById(company);
            tile.querySelector('.error').textContent = 'Failed to load data';
            tile.querySelector('.loading').style.display = 'none';
        }
    }

    for (const company of companies) {
        await fetchData(company);
        
    }
});