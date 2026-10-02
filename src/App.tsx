import type { JSX } from "react";
import { Link, Route, Routes } from "react-router-dom";

function App(): JSX.Element {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/catalogo">Catálogo</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/catalogo" element={<h1>Catálogo</h1>} />
      </Routes>
    </>
  );
}

export default App;