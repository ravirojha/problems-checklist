import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicProgramming from './pages/DynamicProgramming';
import Graph from './pages/Graph';
import TwoPointers from './pages/TwoPointers';
import Home from './pages/Home';
import Header from './components/Header';
import GithubCorner from './components/GithubCorner';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dp" element={<DynamicProgramming />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/two-pointers" element={<TwoPointers />} />
        </Routes>
        <GithubCorner />
      </div>
    </Router>
  );
}

export default App;
