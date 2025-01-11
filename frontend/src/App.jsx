import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './components/Dashboard';

function App() {


  return (
    <>
      <div className="app">
        <Router >
          <Routes>
            <Route path="/" element={<Dashboard />} > </Route>
            </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
