import './App.css'
import Table from './components/table'
import Statistics from './components/statistics'
// import BarChart from './components/barchart'

function App() {
  return (
    <main>
      <h1 style={{ width: 'fit-content', margin: '20px auto 0 auto' }}>Transaction Dashboard</h1>
      <Table />

      <h1 style={{ width: 'fit-content', margin: '20px auto 0 auto' }}>Statistics</h1>
      <Statistics />

      {/* <BarChart /> */}
    </main>
  )
}

export default App
