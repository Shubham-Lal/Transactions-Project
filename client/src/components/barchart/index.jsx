import './style.css'
import { useState, useEffect } from 'react'
import { months } from '../../data/months'

const initialData = [
    { range: "0 - 100", count: 0 },
    { range: "101 - 200", count: 0 },
    { range: "201 - 300", count: 0 },
    { range: "301 - 400", count: 0 },
    { range: "401 - 500", count: 0 },
    { range: "501 - 600", count: 0 },
    { range: "601 - 700", count: 0 },
    { range: "701 - 800", count: 0 },
    { range: "801 - 900", count: 0 },
    { range: "901-above", count: 0 }
];

const BarChart = () => {
    const [selectedMonth, setSelectedMonth] = useState(6);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(initialData);

    const handleMonthData = async (e) => {
        const month = e.target.value;
        const monthValue = parseInt(month, 10);
        if (monthValue >= 1 && monthValue <= 12) setSelectedMonth(monthValue);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/data/get-barchart?month=${selectedMonth}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            const updatedData = initialData.map((item, index) => ({
                ...item,
                count: result[index] ? result[index].count : 0
            }));
            setData(updatedData);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    return (
        <div id="bar-chart">
            <div style={{ width: 'fit-content', margin: '0 auto' }}>
                <select value={selectedMonth} onChange={handleMonthData}>
                    {months.map((item, id) => (
                        <option key={id} value={id + 1}>{item}</option>
                    ))}
                </select>
            </div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <div className="chart">
                    {data.map((item, index) => (
                        <div key={index} className="bar">
                            <div>{item.count > 0 && item.count}</div>
                            <div className="bar-inner" style={{ height: `${item.count * 50}px` }}></div>
                            <div className="x-axis">{item.range}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BarChart;