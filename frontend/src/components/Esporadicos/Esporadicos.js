import React, { useState, useEffect } from "react";
import "./Esporadicos.css";
// const movimientosEsporadicos = [
//     {
//         tipo: "ingreso",
//         descripcion: "Pago de cliente por servicio de diseño gráfico",
//         detalle_pago: "Transferencia bancaria",
//         fecha: "2024-04-01",
//         monto: 500,
//     },
// ];


function Esporadicos() {
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

        fetch("http://localhost:5000/movimiento/esporadico", {
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
        const url = "http://localhost:5000/movimiento/esporadico";

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
                    {movimientos.map((movimiento) => {
                        return (
                            <div className="register" key={movimiento.id}>
                                <div className="detalles">
                                    <span>{movimiento.descripcion}</span>
                                    <div className="Fecha">{movimiento.fecha} - {movimiento.detalle_pago}</div>
                                </div>
                                <div className="monto">
                                    <span>${movimiento.monto}</span>
                                </div>
                            </div>
                        )
                    })}
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


                        {(estadoformG || estadoformI) && (
                            <div className="overlay">
                                <div className="containerOverlay">
                                    <div className="encabezadoOverlay">
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
                                    <form className="formNewG" onSubmit={ (e) => {
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
                                        <button type="submit">
                                            { estadoformG && "Registrar Gasto" }
                                            { estadoformI && "Registrar Ingreso" }
                                        </button>
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
            </div>

        </div>
    );
}

export default Esporadicos;
