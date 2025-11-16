import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function App() {
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  async function fetchPrice() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get(`${API}/price`, { params: { symbol } });
      setPrice(resp.data.price);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get(`${API}/history`, { params: { symbol } });
      setHistory(resp.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>MCP Crypto Dashboard</h1>

      <div className="card">
        {/* Beautiful Dropdown */}
        <div className="dropdown-box">
          <label>Select Coin</label>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            <option value="BTC/USDT">Bitcoin (BTC)</option>
            <option value="ETH/USDT">Ethereum (ETH)</option>
            <option value="BNB/USDT">BNB</option>
            <option value="SOL/USDT">Solana (SOL)</option>
            <option value="XRP/USDT">XRP</option>
            <option value="ADA/USDT">Cardano (ADA)</option>
            <option value="DOGE/USDT">Dogecoin (DOGE)</option>
            <option value="MATIC/USDT">Polygon (MATIC)</option>
          </select>
        </div>

        <div className="buttons">
          <button onClick={fetchPrice}>{loading ? "..." : "Get Price"}</button>
          <button onClick={fetchHistory}>Get 24h History</button>
        </div>

        {error && <div className="error">{error}</div>}
        {price && <div className="price">Price: {price}</div>}
      </div>

      {history.length > 0 && (
        <div className="history">
          <h2>Last 24 Hours (1h)</h2>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.time}>
                  <td>{new Date(h.time).toLocaleString()}</td>
                  <td>{h.open}</td>
                  <td>{h.high}</td>
                  <td>{h.low}</td>
                  <td>{h.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
