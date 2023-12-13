from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
from dotenv import load_dotenv
import requests

load_dotenv()  # Load environment variables from .env file

API_KEY = os.getenv('API_KEY')  # Get API key from environment variable

app = Flask(__name__)
# Allow CORS so that frontend can access backend served from different domains.
CORS(app, resources={r"/*": {"origins": "*"}})

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
        "wendys": "WEN",
        "sodastream": "SODA",
        "cocacola": "KO",
        "pepsi": "PEP",
        "sabra": "STRS"
    }

    symbol = company_symbols.get(company_name)
    if not symbol:
        return jsonify({"error": "Company not found"}), 404

    try:
        current_price = get_stock_price(symbol, "2023-12-11")
        historical_price = get_stock_price(symbol, "2023-10-06")
        if current_price is None or historical_price is None:
            raise ValueError("Could not fetch stock data")
        price_difference = current_price - historical_price
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "company_name": company_name,
        "current_price": current_price,
        "historical_price": historical_price,
        "price_difference": price_difference
    })

if __name__ == '__main__':
    app.run(debug=True)
