import React, { useState, useEffect } from "react";
import "./Esporadicos.css";
import "./EsporadicosMobile.css";
import { serverUrl } from "../../utils/config";
// const movimientosEsporadicos = [
//     {
//         tipo: "ingreso",
//         descripcion: "Pago de cliente por servicio de diseño gráfico",
//         detalle_pago: "Transferencia bancaria",
//         fecha: "2024-04-01",
//         monto: 500,
//     },
// ];


function Esporadicos({ spectator }) {
    //ventanas emergentes ---------------------
    const [estadoformG, cambiarEstadoformG] = useState(false);
    const [estadoformI, cambiarEstadoformI] = useState(false);

    //variables de estado ---------------------
    const [movimientos, setMovimientos] = useState([]);

    //errores ---------------------
    const [errors, setErrors] = useState([]);

    const crearIngresoGasto = (e, tipo) => {
        const descripcion = e.target[0].value;
        const detallePago = e.target[1].value;
        const monto = e.target[2].value;
        const fecha = e.target[3].value;

        const data = {
            "tipo": tipo,
            "descripcion": descripcion,
            "detalle_pago": detallePago,
            "fecha": fecha,
            "monto": monto,
        }

        fetch(serverUrl + "/movimiento/esporadico", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                e.target.reset(); //limpiar formulario
                cambiarEstadoformG(false); //cerrar formulario
                cambiarEstadoformI(false); //cerrar formulario
                setErrors([]); //limpiar errores

                //recargar movimientos
                loadMovimientos();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors([data.message]);
                }
            }
        })
    };
 
    const loadMovimientos = () => {
        const url = serverUrl + "/movimiento/esporadico";

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const esporadicos = data.esporadicos;
                //ordenar por fecha 
                esporadicos.sort((a, b) => {
                    return new Date(b.fecha) - new Date(a.fecha);
                });

                setMovimientos(esporadicos);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors([data.message]);
                }
            }
        })
    };


    // cargar una vez
    useEffect(() => {
        loadMovimientos();
    }, []);

    return (
        <div className="main-container">
            <h1>Esporadicos</h1>
            <div className="esporadicos-container">
                <div className="mov-container">
                    <span>Movimientos</span>
                </div>
                <div className="monto-container">
                    {movimientos.map((movimiento) => {
                        return (
                            <div className={`register tipo-${movimiento.tipo}`} key={movimiento.id}>
                                <div className="detalles">
                                    <span>{movimiento.descripcion}</span>
                                    <div className="Fecha">{movimiento.fecha} - {movimiento.detalle_pago}</div>
                                </div>
                                <div className="monto">
                                    <span
                                        style={
                                            movimiento.tipo === "ingreso" ? {} : { color: "red" }
                                        }
                                    >{movimiento.tipo === "ingreso" ? "+" : "-"} ${movimiento.monto}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                { !spectator && (
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


                            {(estadoformG || estadoformI) && (
                                <div className="floating-window-container floating-window-container-visible">
                                    <div className="floating-window">
                                        <div className="floating-window-header">
                                            <h2>Registrar nuevo Gasto</h2>
                                            <button className="cerrarOverlay" onClick={() => {
                                                cambiarEstadoformG(false);
                                                cambiarEstadoformI(false);
                                                const containerOverlay = document.querySelector('.containerOverlay');
                                                if (containerOverlay) {
                                                    containerOverlay.classList.remove('show');
                                                }
                                            } }>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <form className="floating-window-content" onSubmit={ (e) => {
                                            e.preventDefault();
                                            if (estadoformG) {
                                                crearIngresoGasto(e, "gasto");
                                            } else if (estadoformI) {
                                                crearIngresoGasto(e, "ingreso");
                                            }
                                        }}>
                                            <div className="campo">
                                                <label htmlFor="descripcion">Descripción:</label>
                                                <input type="text" id="descripcion" required />
                                            </div>
                                            <div className="campo">
                                                <label htmlFor="detallePago">Detalle de Pago:</label>
                                                <input type="text" id="detallePago" required />
                                            </div>
                                            <div className="campo">
                                                <label htmlFor="monto">Monto:</label>
                                                <input type="number" id="monto" required />
                                            </div>
                                            <div className="campo">
                                                <label htmlFor="fecha">Fecha:</label>
                                                <input type="date" id="fecha" required />
                                            </div>
                                            <li>
                                                {errors.map((error) => (
                                                    <div className="error">{error}</div>
                                                ))}
                                            </li>
                                            <div className="floating-window-buttons">
                                                <button type="submit" className="floating-window-buttons-submit">
                                                    { estadoformG && "Registrar Gasto" }
                                                    { estadoformI && "Registrar Ingreso" }
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="ingresoN">
                            <button className="ingresoB" onClick={() => {
                                cambiarEstadoformI(!estadoformI); 
                                const containerOverlay = document.querySelector('.containerOverlay');
                                if (containerOverlay) {
                                    containerOverlay.classList.add('show');
                                }
                            }}>
                                Nuevo Ingreso
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Esporadicos;
