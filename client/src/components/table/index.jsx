import './style.css'
import { useState, useEffect } from 'react'
import { months } from '../../data/months'

const Table = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        const queryParams = [];

        if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
        if (selectedMonth !== null) queryParams.push(`month=${selectedMonth}`);
        
        queryParams.push(`page=${page}`);
        const queryString = queryParams.join('&');

        await fetch(`${import.meta.env.VITE_SERVER_URL}/data/list-transactions?${queryString}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    };

    const handleMonthData = (e) => {
        const month = parseInt(e.target.value, 10);
        if (month === -1) {
            setPage(1);
            setSelectedMonth(null);
        } else if (month >= 1 && month <= 12) {
            setPage(1);
            setSelectedMonth(month);
        }
    };

    const handlePageChange = (action) => {
        let newPage = page;
        if (action === "previous" && page === 1) return;
        else if (action === "previous" && page > 1) newPage -= 1;
        else if (action === "next") newPage += 1;
        setPage(newPage);
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm, selectedMonth, page]);

    return (
        loading ? <p>Fetching data...</p> : (
            <div id='table'>
                <div className='parameter'>
                    <input
                        placeholder='Search Transactions'
                        value={searchTerm}
                        onChange={(e) => {
                            setPage(1);
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <select onChange={handleMonthData}>
                        <option value="-1">{selectedMonth !== null ? "Clear" : "Select"} Month</option>
                        {months.map((item, id) => (
                            <option key={id} value={id + 1}>{item}</option>
                        ))}
                    </select>
                </div>


                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Sold</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            ) : data.map(item => (
                                <tr key={item._id}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{Number(item.price).toFixed(2)}</td>
                                    <td>{item.category}</td>
                                    <td>{item.sold ? 'Sold' : 'Unsold'}</td>
                                    <td><img src={item.image} style={{ width: '50px', height: '50px', objectFit: 'contain' }} alt={item.title} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='options'>
                    <p>Page No: {page}</p>
                    <div>
                        <button onClick={() => handlePageChange("previous")}>Previous</button>
                        -
                        <button onClick={() => handlePageChange("next")}>Next</button>
                    </div>
                    <p>Per Page: 10</p>
                </div>
            </div>
        )
    )
}

export default Table