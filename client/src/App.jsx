import './App.css'
import Table from './components/table'
import Statistics from './components/statistics'
import BarChart from './components/barchart'

function App() {
  return (
    <main>
      <div>
        <h1>Transaction Dashboard</h1>
        <Table />
      </div>

      <div>
        <h1>Statistics</h1>
        <Statistics />
      </div>

      <div>
        <h1>Bar Chart</h1>
        <BarChart />
      </div>
    </main>
  )
}

export default App
