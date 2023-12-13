from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
from serpapi import GoogleSearch

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow CORS so that frontend can access backend served from different domains.

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

historical_prices = {
    "starbucks": 92.85,
    "mcdonalds": 248.22,
    "disney": 82.94,
    "cocacola": 53.14,
    "pepsi": 160.29,
    "sabra": 13.91
}

historical_caps = {
    "starbucks": 106090000000,
    "mcdonalds": 180890000000,
    "disney": 151780000000,
    "cocacola": 229780000000,
    "pepsi": 220380000000,
    "sabra": 3237000000
}

def get_current_stock_price(symbol):
    """Fetch current stock price using SerpAPI Google Finance."""
    params = {
        "engine": "google_finance",
        "q": symbol,
        "hl": "en",
        "api_key": SERPAPI_KEY
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        summary = results.get('summary', {})
        extracted_price = summary.get('extracted_price')
        return float(extracted_price) if extracted_price is not None else None
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return None

def get_graph_data(symbol):
    """Fetch historical stock data for graphing using SerpAPI."""
    params = {
        "engine": "google_finance",
        "q": symbol,
        "hl": "en",
        "api_key": SERPAPI_KEY,
        "window": "1M"  # Adjust the window parameter as needed
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        # Adjust this line based on the actual structure of the SerpAPI response
        graph_data = results.get('graph', [])
        return graph_data
    except Exception as e:
        print(f"Error fetching graph data for {symbol}: {e}")
        return []

@app.route('/stock_data/<company_name>')
@cross_origin()
def stock_data(company_name):
    company_symbols = {
        "starbucks": "SBUX:NASDAQ",
        "mcdonalds": "MCD:NYSE",
        "disney": "DIS:NYSE",
        "cocacola": "KO:NYSE",
        "pepsi": "PEP:NASDAQ",
        "sabra": "SBRA:NASDAQ"
    }
    symbol = company_symbols.get(company_name.lower())
    if not symbol:
        return jsonify({"error": "Company not found"}), 404

    try:
        current_price = get_current_stock_price(symbol)
        if current_price is None:
            raise ValueError(f"Current price for {company_name} not available")

        historical_price = historical_prices[company_name.lower()]
        market_cap = historical_caps[company_name.lower()]
        price_difference = round(current_price - historical_price, 2)
        graph_data = get_graph_data(symbol)

        return jsonify({
            "company_name": company_name.title(),
            "current_price": '${:,.2f}'.format(current_price),
            "historical_price": '${:,.2f}'.format(historical_price),
            "market_cap": '${:,.2f}bn'.format(market_cap / 1_000_000_000),
            "price_difference": '${:,.2f}'.format(price_difference),
            "graph": graph_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)