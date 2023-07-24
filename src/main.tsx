import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { useEffect, useState } from 'react';


const App = () => {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const titles = ['T', 'r', '0', 'L', 'l', 'I', 'n', 'G'];

    const interval = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTitle = () => {
    const word = 'Tr0LlInG';
    return `${word.charAt(titleIndex)}`;
  };

  useEffect(() => {
    document.title = getTitle();
  }, [titleIndex]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}



ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
