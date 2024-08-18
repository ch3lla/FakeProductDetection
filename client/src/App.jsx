import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <Web3Provider>
        <div id="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addProduct" element={<AddProduct />} />
          </Routes>
        </div>
    </Web3Provider>
  );
}

export default App;
