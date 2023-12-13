from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
from dotenv import load_dotenv
import requests

load_dotenv()  # Load environment variables from .env file

# API_KEY = os.getenv('API_KEY')  # Get API key from environment variable
API_KEY = 'DQL51N03JZSHXA6Z'
app = Flask(__name__)
# Allow CORS so that frontend can access backend served from different domains.
CORS(app, resources={r'/*': {'origins': '*'}})

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

def get_stock_price(symbol, date=None): # date format: YYYY-MM-DD
    """Fetch stock price for a given symbol and date from Alpha Vantage."""
    if date:
        endpoint = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}'
        response = requests.get(endpoint)
        data = response.json()
        print(data)
        # Extract the closing price for the specified date
        price = data['Time Series (Daily)'][date]['4. close']
    else:
        endpoint = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}'
        response = requests.get(endpoint)
        data = response.json()
        print(data)
        # Extract the current price
        price = data['Global Quote']['05. price']
    
    return float(price)


@app.route('/stock_data/<company_name>')
@cross_origin()  # This enables CORS specifically for this route
def stock_data(company_name):
    # Convert company_name to the correct format (e.g., capitalize)
    company_name_formatted = company_name.capitalize()
    # Map company names to their stock symbols
    company_symbols = {
        "starbucks": "SBUX",
        "mcdonalds": "MCD",
        "disney": "DIS",
        "cocacola": "KO",
        "pepsi": "PEP",
        "sabra": "STRS"
    }

    company_name_formatted = company_name.lower()  # Assuming lowercase for keys
    symbol = company_symbols.get(company_name_formatted)
    if not symbol:
        return jsonify({"error": "Company not found"}), 404

    try:
        current_price = get_stock_price(symbol)
        historical_price = historical_prices.get(company_name_formatted)
        market_cap = historical_caps.get(company_name_formatted)
        price_difference = current_price - historical_price
        return jsonify({
            "company_name": company_name_formatted,
            "current_price": current_price,
            "historical_price": historical_price,
            "market_cap": market_cap,
            "price_difference": price_difference
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
