import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './App.css';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const averageValues = {
    co2: 400,
    ozone: 0.05,
    tvoc: 370
};

function message(real, avg) {
    if (real > avg) return "Real time value is higher than the average.";
    if (real < avg) return "Real time value is lower than the average.";
    return "Real time value is the same as the average.";
}

function parseNumericValue(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

function App() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [airQualityData, setAirQualityData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setAirQualityData(null);
        setLoading(true);

        try {
            const isoDateTime = selectedDateTime.toISOString();
            const response = await axios.get(`https://localhost:7285/api/AirQuality/${isoDateTime}`);
            setAirQualityData(response.data);
        } catch (error) {
            setError("No data found for the specified date and time!");
        } finally {
            setLoading(false);
        }
    };

    const co2TvocChartData = airQualityData
        ? [
            { name: 'CO2', value: parseNumericValue(airQualityData.co2), unit: 'PPM' },
            { name: 'TVOC', value: parseNumericValue(airQualityData.tvoc), unit: 'PPM' },
        ]
        : [];

    const ozoneChartData = airQualityData
        ? [
            { name: 'Ozone', value: parseNumericValue(airQualityData.ozone), unit: 'PPM' }
        ]
        : [];

    return (
        <div className="App">
            <h1>Air Quality Data</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="datetime">Date and Time:</label>
                    <DatePicker
                        id="datetime"
                        selected={selectedDateTime}
                        onChange={date => setSelectedDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="yyyy-MM-dd h:mm aa"
                    />
                </div>
                <button type="submit">Find data</button>
            </form>
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {airQualityData && (
                <>
                    <div className="main-layout">
                        <div className="result">
                            <h2>Air Quality Data for {selectedDateTime.toLocaleString()}</h2>
                            <p>CO2: {airQualityData.co2}</p>
                            <p>Ozone: {airQualityData.ozone}</p>
                            <p>TVOC: {airQualityData.tvoc}</p>
                        </div>
                        <div className="comparison-panel">
                            <h3>Comparison to Average</h3>
                            <div className="comparison-row">
                                <span className="molecule-name">CO2:</span><br />
                                <span className="real">Real-time value: {parseNumericValue(airQualityData.co2)} PPM</span><br />
                                <span className="avg">Average value: {averageValues.co2} PPM</span>
                                <span className="cmp-msg">{message(parseNumericValue(airQualityData.co2), averageValues.co2)}</span>
                            </div>
                            <div className="comparison-row">
                                <span className="molecule-name">Ozone:</span><br />
                                <span className="real">Real value: {parseNumericValue(airQualityData.ozone)} PPM</span><br />
                                <span className="avg">Average value: {averageValues.ozone} PPM</span>
                                <span className="cmp-msg">{message(parseNumericValue(airQualityData.ozone), averageValues.ozone)}</span>
                            </div>
                            <div className="comparison-row">
                                <span className="molecule-name">TVOC:</span><br />
                                <span className="real">Real value: {parseNumericValue(airQualityData.tvoc)} PPM</span><br />
                                <span className="avg">Average value: {averageValues.tvoc} PPM</span>
                                <span className="cmp-msg">{message(parseNumericValue(airQualityData.tvoc), averageValues.tvoc)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container">
                        <h3>CO2 and TVOC</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={co2TvocChartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value, name, props) => [`${value} PPM`, name]} />
                                <Legend />
                                <Bar dataKey="value" fill="#007bff" label={{ position: 'top' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h3>Ozone</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={ozoneChartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, Math.max(0.06, ozoneChartData[0]?.value * 1.5)]} />
                                <Tooltip formatter={(value, name, props) => [`${value} PPM`, name]} />
                                <Legend />
                                <Bar dataKey="value" fill="#28a745" label={{ position: 'top' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
