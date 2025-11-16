from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

BINANCE_URL = "https://api.binance.com/api/v3"

@app.get("/api/health")
def health():
    return jsonify({"status":"ok"})

@app.get("/api/price")
def get_price():
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error":"symbol required"}), 400
    formatted = symbol.replace("/", "").upper()
    url = f"{BINANCE_URL}/ticker/price?symbol={formatted}"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        return jsonify({"symbol": symbol.upper(), "price": data.get("price")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/api/history")
def get_history():
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error":"symbol required"}), 400
    formatted = symbol.replace("/", "").upper()
    url = f"{BINANCE_URL}/klines?symbol={formatted}&interval=1h&limit=24"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        mapped = [{"time": c[0], "open": c[1], "high": c[2], "low": c[3], "close": c[4], "volume": c[5]} for c in data]
        return jsonify(mapped)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask backend on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
