import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";

const HexaColor = ({ cantidad, handleCopy }) => {
  const str = "0123456789abcdef";
  const colores = [];
  const wrapperRef = useRef([]);

  for (let a = 0; a < cantidad; a++) {
    let color = "";
    for (let i = 0; i < 6; i++) {
      const aleatorioHexa = Math.floor(Math.random() * str.length);
      color += str[aleatorioHexa];
    }
    colores.push({ id: a, color: "#" + color });
  }

  const handleClick = useCallback(
    (colorId) => {
      handleCopy(colores[colorId].color);
      const elementoWrapper = wrapperRef.current[colorId];
      elementoWrapper.classList.remove("copy");
      elementoWrapper.classList.add("copied");
      setTimeout(() => {
        elementoWrapper.classList.add("copy");
        elementoWrapper.classList.remove("copied");
      }, 2000);
    },
    [colores, handleCopy]
  );

  return (
    <div className="color-wrapper">
      {colores.map((color) => (
        <div
          id={color.id}
          key={color.id}
          className="color-unico"
          style={{
            background: color.color,
          }}
        >
          <small style={{ fontWeight: 500 }}>{color.color}</small>
          <div
            ref={(elemento) => (wrapperRef.current[color.id] = elemento)}
            className={"copiar_wrapper copy"}
            key={color.id}
          >
            <i
              className="far fa-clipboard"
              style={{
                cursor: "pointer",
                fontSize: "28px",
                color: "white",
              }}
              onClick={() => handleClick(color.id)}
              title="Copiar"
              data-title="Copiar"
            ></i>
          </div>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [cantidad, setCantidad] = useState(27);
  const [coloresGenerados, setColoresGenerados] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setColoresGenerados(
      <HexaColor cantidad={cantidad} handleCopy={handleCopy} />
    );
  }, [cantidad]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Texto copiado al portapapeles: ", text);
      })
      .catch((error) => {
        console.error("Error al copiar al portapapeles: ", error);
      });
  }, []);

  const handleClick = useCallback(() => {
    if (ref.current.value === "" || isNaN(ref.current.value)) {
      setCantidad(Number(cantidad));
      setColoresGenerados(
        <HexaColor cantidad={cantidad} handleCopy={handleCopy} />
      );
    } else {
      setCantidad(Number(ref.current.value));
      setColoresGenerados(
        <HexaColor cantidad={cantidad} handleCopy={handleCopy} />
      );
    }
  }, [cantidad]);

  return (
    <div className="App">
      <div className="color-app">
        <div
          style={{
            fontSize: "22px",
            fontWeight: 100,
            color: "black",
            textAlign: "center",
            margin: "auto",
            fontFamily: "Aldrich",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              margin: "20px 0px 0px",
              fontWeight: 500,
            }}
          >
            App Colores Hexadecimales Aleatorios
          </h1>
          <h2
            style={{
              fontSize: "40px",
              margin: "0px 0px 30px",
              fontWeight: 300,
              fontFamily: "Roboto",
            }}
          >
            Colores hexadecimales
          </h2>
        </div>
        <div className="color-generar-row">
          <div className="formulario">
            <input
              type="text"
              placeholder="Inserte cantidad de colores"
              ref={ref}
            />
          </div>
          <button className="generar-color-btn" onClick={handleClick}>
            Generar
          </button>
        </div>
        {coloresGenerados}
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
