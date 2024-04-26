import React, { useState } from "react";
import "./Esporadicos.css";
const movimientosEsporadicos = [
  {
    tipo: "ingreso",
    descripcion: "Pago de cliente por servicio de diseño gráfico",
    detalle_pago: "Transferencia bancaria",
    fecha: "2024-04-01",
    monto: 500,
  },
  {
    tipo: "gasto",
    descripcion: "Compra mensual de víveres en el supermercado",
    detalle_pago: "Pago con tarjeta de débito",
    fecha: "2024-04-05",
    monto: 200,
  },
  {
    tipo: "ingreso",
    descripcion: "Pago de renta del apartamento",
    detalle_pago: "Depósito bancario",
    fecha: "2024-04-10",
    monto: 1000,
  },
  {
    tipo: "gasto",
    descripcion: "Compra de boletos para concierto",
    detalle_pago: "Compra en línea con tarjeta de crédito",
    fecha: "2024-04-15",
    monto: 150,
  },
  {
    tipo: "ingreso",
    descripcion: "Pago de cliente por servicio de diseño gráfico",
    detalle_pago: "Transferencia bancaria",
    fecha: "2024-04-01",
    monto: 500,
  },
  {
    tipo: "gasto",
    descripcion: "Compra mensual de víveres en el supermercado",
    detalle_pago: "Pago con tarjeta de débito",
    fecha: "2024-04-05",
    monto: 200,
  },
  {
    tipo: "ingreso",
    descripcion: "Pago de renta del apartamento",
    detalle_pago: "Depósito bancario",
    fecha: "2024-04-10",
    monto: 1000,
  },
  {
    tipo: "gasto",
    descripcion: "Compra de boletos para concierto",
    detalle_pago: "Compra en línea con tarjeta de crédito",
    fecha: "2024-04-15",
    monto: 150,
  },
];

console.log(movimientosEsporadicos);

function Esporadicos() {
    const [mostrarFormularioGasto, setMostrarFormularioGasto] = useState(false);
    const [mostrarFormularioIngreso, setMostrarFormularioIngreso] = useState(false);
    const [estadoformG, cambiarEstadoformG] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [detallePago, setDetallePago] = useState("");
    const [monto, setMonto] = useState("");
    const toggleFormularioGasto = () => {
        setMostrarFormularioGasto(!mostrarFormularioGasto);
        if(mostrarFormularioIngreso){
            setMostrarFormularioIngreso(false);
        }
    };

    const toggleFormularioIngreso = () => {
        setMostrarFormularioIngreso(!mostrarFormularioIngreso);
        if(mostrarFormularioGasto){
            setMostrarFormularioGasto(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(descripcion, detallePago, monto);
        setDescripcion("");
        setDetallePago("");
        setMonto("");
        cambiarEstadoformG(false);
    };

    return (
        <div className="main-container">
            <h1>Esporadicos</h1>
            <div className="esporadicos-container">
                <div className="mov-container">
                    <span>Movimientos</span>
                    <div className="todo-mov">
                        <div className="ver-todo" onClick={() => console.log("Todos")}>
                            <span onClick={() => console.log("Todo")}>Ver Todos </span>
                        </div>
                        <div className="mov" onClick={() => console.log("Fecha")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="max-w-[20px] max-w-h-[20px] fit-content"
                                onClick={() => console.log("Fecha")}>
                                <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                <path
                                    fillRule="evenodd"
                                    d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="monto-container">
                {movimientosEsporadicos.map((movimiento) => { 
                    console.log(movimiento)
                    return(
                    <div className="register">
                        <div className="detalles">
                            <span>{movimiento.descripcion}</span>
                            <div className="Fecha">{movimiento.fecha} - {movimiento.detalle_pago}</div>
                        </div>
                        <div className="monto">
                            <span>${movimiento.monto}</span>
                        </div>
                    </div>
                )})}
                </div>
                        <div className="nuevo">
                        <div className="gastoN">
                        <button className="gastoB" onClick={() => {
                            cambiarEstadoformG(!estadoformG);
                            const containerOverlay = document.querySelector('.containerOverlay');
                            if (containerOverlay) {
                                containerOverlay.classList.add('show');
                            }
                        }}>
                            Nuevo Gasto
                        </button>


                    {estadoformG && (
                        <div className="overlay">
                            <div className="containerOverlay">
                                <div className="encabezadoOverlay">
                                    <h2>Registrar nuevo Gasto</h2>
                                    <button className="cerrarOverlay" onClick={() => cambiarEstadoformG(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="formNewG">
                                    <div className="campo">
                                        <label htmlFor="descripcion">Descripción:</label>
                                        <input type="text" id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                                    </div>
                                    <div className="campo">
                                        <label htmlFor="detallePago">Detalle de Pago:</label>
                                        <input type="text" id="detallePago" value={detallePago} onChange={e => setDetallePago(e.target.value)} />
                                    </div>
                                    <div className="campo">
                                        <label htmlFor="monto">Monto:</label>
                                        <input type="number" id="monto" value={monto} onChange={e => setMonto(e.target.value)} />
                                    </div>
                                    <button type="submit">Agregar Gasto</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="ingresoN">
                    <button className="ingresoB" onClick={() => console.log("Ingreso")}>
                        Nuevo Ingreso
                    </button>
                </div>
            </div>
            </div>

        </div>
    );
}

export default Esporadicos;
