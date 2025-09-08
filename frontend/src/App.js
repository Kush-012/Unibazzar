import './App.css';
import Nav from './Components/Nav.js';
import Footer from './Components/footer.js';
import SignUp from './Components/SignUp.js';
import Login from './Components/Login.js';
import Home from './Components/Home.js';   
import Report from './Components/reportitem.js';
import Find from './Components/finditem.js';
import Chat from './Components/chat.js';
import Chatbot from './Components/chatbot.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/finditem" element={<Find/>} />
          <Route path="/reportitem" element={<Report/>} />
           <Route path="/chat" element={<Chat/>} />

          <Route path="/logout" element={<h1>Logout</h1>} />

          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Chatbot />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
