import { useEffect, useState } from 'react';
import './style.css';

function Parejas() {
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [turnoJugador, setTurnoJugador] = useState(1);
  const [puntos, setPuntos] = useState({ 1: 0, 2: 0 });
  const [tiempo, setTiempo] = useState(0);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  const generarCartas = () => {
    fetch('https://hp-api.onrender.com/api/characters')
      .then(res => res.json())
      .then(data => {
        const personajesConImagen = data.filter(p => p.image).slice(0, 14); // 10 pares
        const duplicadas = [...personajesConImagen, ...personajesConImagen]
          .map(p => ({ ...p, id: Math.random() }))
          .sort(() => 0.5 - Math.random());

        setCartas(duplicadas);
        setSeleccionadas([]);
        setEncontradas([]);
        setTurnoJugador(1);
        setPuntos({ 1: 0, 2: 0 });
        setTiempo(0);
        setTemporizadorActivo(true);
      });
  };

  useEffect(() => {
    generarCartas();
  }, []);

  // Temporizador
  useEffect(() => {
    let intervalo;
    if (temporizadorActivo) {
      intervalo = setInterval(() => {
        setTiempo(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [temporizadorActivo]);

  const manejarSeleccion = (carta) => {
    if (seleccionadas.length < 2 && !seleccionadas.includes(carta) && !encontradas.includes(carta.name)) {
      setSeleccionadas([...seleccionadas, carta]);
    }
  };

  useEffect(() => {
    if (seleccionadas.length === 2) {
      const [primera, segunda] = seleccionadas;
      if (primera.name === segunda.name) {
        // Pareja encontrada
        setEncontradas(prev => [...prev, primera.name]);
        setPuntos(prev => ({
          ...prev,
          [turnoJugador]: prev[turnoJugador] + 1,
        }));
        setTimeout(() => setSeleccionadas([]), 1000);
      } else {
        // Cambio de turno
        setTimeout(() => {
          setSeleccionadas([]);
          setTurnoJugador(prev => (prev === 1 ? 2 : 1));
        }, 1000);
      }
    }
  }, [seleccionadas]);

  const minutos = Math.floor(tiempo / 60);
  const segundos = tiempo % 60;

  const totalParejas = 14;
  const juegoTerminado = encontradas.length === totalParejas;

  let resultadoFinal = '';
  if (juegoTerminado) {
    if (puntos[1] > puntos[2]) resultadoFinal = '🎉 ¡Jugador 1 gana!';
    else if (puntos[2] > puntos[1]) resultadoFinal = '🎉 ¡Jugador 2 gana!';
    else resultadoFinal = '🤝 ¡Empate!';
  }

  return (
    <div className="juego-parejas">
      <h2>Encuentra la Pareja</h2>

      <div className="info-juego">
        <p><strong>Jugador actual:</strong> {turnoJugador}</p>
        <p><strong>Puntos Jugador 1:</strong> {puntos[1]}</p>
        <p><strong>Puntos Jugador 2:</strong> {puntos[2]}</p>
        <p><strong>Tiempo:</strong> {minutos.toString().padStart(2, '0')}:{segundos.toString().padStart(2, '0')}</p>
      </div>

      <button onClick={generarCartas} className="boton-reiniciar">🔄 Reiniciar Juego</button>

      <div className="tablero">
        {cartas.map(carta => {
          const volteada = seleccionadas.includes(carta) || encontradas.includes(carta.name);
          return (
            <div
              key={carta.id}
              className={`carta ${volteada ? 'volteada' : ''}`}
              onClick={() => manejarSeleccion(carta)}
            >
              <div className="carta-inner">
                <div className="carta-back">🎩</div>
                <div className="carta-front">
                  <img src={carta.image} alt={carta.name} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {juegoTerminado && <p className="ganaste">{resultadoFinal}</p>}
    </div>
  );
}

export default Parejas;
