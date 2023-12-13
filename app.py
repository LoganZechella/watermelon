from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import os
from dotenv import load_dotenv
import requests

load_dotenv()  # Load environment variables from .env file

API_KEY = os.getenv('API_KEY')  # Get API key from environment variable

app = Flask(__name__)
CORS(app)  # Allow CORS so that frontend can access backend served from different domains.

def get_stock_price(symbol, date=None):
    """Fetch stock price for a given symbol and date from Alpha Vantage."""
    if date:
        endpoint = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}'
        response = requests.get(endpoint)
        data = response.json()
        # Extract the closing price for the specified date
        price = data['Time Series (Daily)'][date]['4. close']
    else:
        endpoint = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}'
        response = requests.get(endpoint)
        data = response.json()
        # Extract the current price
        price = data['Global Quote']['05. price']

    return float(price)

@app.route('/stock_data/<company_name>')
@cross_origin()  # This enables CORS specifically for this route
def stock_data(company_name):
    # Map company names to their stock symbols
    company_symbols = {
        "Starbucks": "SBUX",
        "McDonalds": "MCD",
        "Disney": "DIS",
        "Wendy’s": "WEN",
        "Sodastream": "SODA",
        "Coca-Cola": "KO",
        "Pepsi": "PEP",
        "Sabra": "STRS"
    }

    symbol = company_symbols.get(company_name)
    if not symbol:
        return jsonify({"error": "Company not found"}), 404

    try:
        current_price = get_stock_price(symbol)
        historical_price = get_stock_price(symbol, "2023-10-06")
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
