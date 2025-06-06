import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexto/contexto';

import Menu from './componentes/menu'
import Aleatorios from './componentes/aleatorios';
import Lista from './componentes/lista';
import Capturados from './componentes/capturados';
import Favoritos from './componentes/favoritos';
import Detalle from './componentes/detalle';
import Parejas from './componentes/parejas/Parejas';

function App() {

  return (
    <AppProvider>
    <Router>
      <Menu />

      <Routes>
        <Route path="/" element={<Lista />} />
        <Route path="/aleatorios" element={<Aleatorios />} />
        <Route path="/capturados" element={<Capturados />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/detalle/:name" element={<Detalle />} />
        <Route path="/parejas" element={<Parejas />} />
      </Routes>

    </Router>
    </AppProvider>
  );
}

export default App;