import './Resumen.css';
import './ResumenMobile.css';
import { useState, useEffect } from 'react';
import { serverUrl } from '../../utils/config';

function Resumen({ spectator }) {

    const [year, setYear] = useState(new Date().getFullYear());

    const [earnings, setEarnings] = useState(0);

    const [ingresosEsporadicos, setIngresosEsporadicos] = useState([]);
    const [gastosEsporadicos, setGastosEsporadicos] = useState([]);
    const [ingresosFijos, setIngresosFijos] = useState([]);
    const [gastosFijos, setGastosFijos] = useState([]);

    const [sumaIngresosEsporadicos, setSumaIngresosEsporadicos] = useState(0);
    const [sumaGastosEsporadicos, setSumaGastosEsporadicos] = useState(0);
    const [sumaIngresosFijos, setSumaIngresosFijos] = useState(0);
    const [sumaGastosFijos, setSumaGastosFijos] = useState(0);


    useEffect(() => {
        getData(year);
        //cerrar listas al cambiar de año
        let displayButtons = document.querySelectorAll('.display-button');
        displayButtons.forEach(button => {
            button.classList.remove('rotation-180');
        });

        let lists = document.querySelectorAll('.list-card ul');
        lists.forEach(list => {
            list.style.display = 'none';
        });
    }, [year]);


    const displayList = (e) => {
        let list = e.target.parentElement.nextElementSibling;
        let display = list.style.display;

        e.target.classList.toggle('rotation-180');

        if (display === 'none' || display === '') {
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
        }
    }

    const getData = (querie_year) => {
        const url = serverUrl + "/movimiento?anio=" + querie_year;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                /* Example data:
                {
                    "ganancia": 0,
                    "gastos": {
                        "esporadicos": [
                            {
                                "descripcion": "asdsvdgbf",
                                "detalle_pago": "asdsvd",
                                "fecha": "Fri, 05 Apr 2024 00:00:00 GMT",
                                "id": "b083110b-f02f-4250-b544-a4db0b5b5dfb",
                                "monto": 87,
                                "tipo": "gasto"
                            },
                            {
                                "descripcion": "654312",
                                "detalle_pago": "654321",
                                "fecha": "Thu, 02 May 2024 00:00:00 GMT",
                                "id": "3f45cfc5-8dee-4fbf-9a77-01910e09e42c",
                                "monto": 645132,
                                "tipo": "gasto"
                            }
                        ],
                        "fijos": [],
                        "total": 0
                    },
                    "ingresos": {
                        "esporadicos": [
                            {
                                "descripcion": "MeliPago2",
                                "detalle_pago": "Pago en efectivo",
                                "fecha": "Thu, 02 May 2024 00:00:00 GMT",
                                "id": "83fd20ad-dba6-461b-8a8f-61128cdc9646",
                                "monto": 75,
                                "tipo": "ingreso"
                            },
                            {
                                "descripcion": "Ingreso1",
                                "detalle_pago": "741",
                                "fecha": "Wed, 01 May 2024 00:00:00 GMT",
                                "id": "adc4177f-ee44-4872-881d-0ea452863b54",
                                "monto": 100,
                                "tipo": "ingreso"
                            }
                        ],
                        "fijos": [],
                        "total": 0
                    },
                    "success": true
                }
                */

                if (data.success) {

                    //set sumas
                    setSumaIngresosEsporadicos(data.ingresos.esporadicos.reduce((sum, ingreso) => sum + ingreso.monto, 0));
                    setSumaGastosEsporadicos(data.gastos.esporadicos.reduce((sum, gasto) => sum + gasto.monto, 0));
                    setSumaIngresosFijos(data.ingresos.fijos.reduce((sum, ingreso) => sum + ingreso.monto, 0));
                    setSumaGastosFijos(data.gastos.fijos.reduce((sum, gasto) => sum + gasto.monto, 0));

                    //Set earnings
                    let ganancia = data.ingresos.esporadicos.reduce((sum, ingreso) => sum + ingreso.monto, 0) - data.gastos.esporadicos.reduce((sum, gasto) => sum + gasto.monto, 0);

                    setEarnings(ganancia);

                    //Set list
                    setIngresosEsporadicos(data.ingresos.esporadicos.map(ingreso => {
                        return {
                            concepto: ingreso.descripcion,
                            cantidad: ingreso.monto
                        }
                    }));

                    setGastosEsporadicos(data.gastos.esporadicos.map(gasto => {
                        return {
                            concepto: gasto.descripcion,
                            cantidad: gasto.monto
                        }
                    }));

                    setIngresosFijos(data.ingresos.fijos.map(ingreso => {
                        return {
                            concepto: ingreso.observacion,
                            cantidad: ingreso.monto
                        }
                    }));

                    setGastosFijos(data.gastos.fijos.map(gasto => {
                        return {
                            concepto: gasto.deber.descripcion,
                            cantidad: gasto.monto
                        }
                    }));
                } else {
                    console.log(data);
                }

            })
    }

    return (
        <div className="main-container">
            <h1 className='h1-resumen'>
                Resumen
                <div className='change-year'>
                    <button className='change-year-button' onClick={() => setYear(year - 1)}>{'<'}</button>
                    <div className='year'>{year}</div>
                    <button className='change-year-button' onClick={() => setYear(year + 1)}>{'>'}</button>
                </div>
            </h1>
            <div className="resumen-container">
                <div className='sub-card esporadicos'>
                    <h2>Esporádicos</h2>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Ingresos Esporádicos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-esporadicos'>{sumaIngresosEsporadicos}</h3>
                        </div>
                        <ul style={{ display: 'none' }}>
                            {ingresosEsporadicos.map((ingreso, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{ingreso.concepto}</h4>
                                        <p style={{ color: 'green' }}
                                        >+ ${ingreso.cantidad}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Gastos Esporádicos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-esporadicos'>{sumaGastosEsporadicos}</h3>
                        </div>
                        <ul style={{ display: 'none' }}>
                            {gastosEsporadicos.map((gasto, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{gasto.concepto}</h4>
                                        <p style={{ color: 'red' }}
                                        >- ${gasto.cantidad}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className='sub-card fijos'>
                    <h2>Fijos</h2>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Ingresos Fijos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-fijos'>{sumaIngresosFijos}</h3>
                        </div>
                        <ul style={{ display: 'none' }}>
                            {ingresosFijos.map((ingreso, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{ingreso.concepto}</h4>
                                        <p style={{ color: 'green' }}
                                        >+ ${ingreso.cantidad}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Gastos Fijos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-fijos'>{sumaGastosFijos}</h3>
                        </div>
                        <ul style={{ display: 'none' }}>
                            {gastosFijos.map((gasto, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{gasto.concepto}</h4>
                                        <p style={{ color: 'red' }}
                                        >- ${gasto.cantidad}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="sub-card resumen-total">
                    <h2>Ganancias: {earnings}</h2>
                </div>
                <div className='sub-card showMobile logout-mobile-container'>
                    <button className='logout-mobile' onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.setItem('espectador', false);
                        window.location.href = '/login-register';
                    }}>Cerrar sesión</button>
                </div>
            </div>

        </div>
    );
}

export default Resumen;