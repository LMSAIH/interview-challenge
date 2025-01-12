import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import { useAuthContext } from './hooks/useAuthContext';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Create from './pages/Create';

function App() {
  const { user } = useAuthContext();

  return (
    <>
      <div className="app">

        <Router>
          {user && <Navbar />}
          <Routes>
            <Route path="/" element={user ? <Home /> : <LogIn />} />
            <Route path="/watchlist" element={user ? <Watchlist /> : <LogIn />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/search" element={user ? <Search /> : <LogIn />} />
            <Route path="/createNew" element={user ? <Create /> : <LogIn />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;

