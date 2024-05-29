import './style.css'
import { useState, useEffect } from 'react'
import { months } from '../../data/months'

const Statistics = () => {
    const [selectedMonth, setSelectedMonth] = useState(6);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const handleMonthData = async (e) => {
        const month = e.target.value;

        const monthValue = parseInt(month, 10);
        if (monthValue >= 1 && monthValue <= 12) setSelectedMonth(monthValue);
    };

    const fetchData = async () => {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/data/get-statistics?month=${selectedMonth}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    return (
        <div id='statistics' style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ width: 'fit-content', margin: '0 auto' }}>
                <select value={selectedMonth} onChange={handleMonthData}>
                    {months.map((item, id) => (
                        <option key={id} value={id + 1}>{item}</option>
                    ))}
                </select>
            </div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '400px', margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <td>Total sale</td>
                            <td>{loading ? 'Fetching...' : Number(data.totalSaleAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total sold item</td>
                            <td>{loading ? 'Fetching...' : data.soldItemsCount}</td>
                        </tr>
                        <tr>
                            <td>Total not sold item</td>
                            <td>{loading ? 'Fetching...' : data.notSoldItemsCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Statistics