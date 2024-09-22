import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageOne, PageTwo, SignupForm } from './Components/Pages';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageOne />} />
          <Route path="/login" element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
