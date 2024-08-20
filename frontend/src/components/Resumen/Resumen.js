import './Resumen.css';
import './ResumenMobile.css';
import { useState, useEffect } from 'react';
import { serverUrl } from '../../utils/config';

function Resumen({ spectator }) {

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    
    const monthAdd = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    }

    const monthSubstract = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    }

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
        getData(year, month);
        //cerrar listas al cambiar de año
        let displayButtons = document.querySelectorAll('.display-button');
        displayButtons.forEach(button => {
            button.classList.remove('rotation-180');
        });

        let lists = document.querySelectorAll('.list-card ul');
        lists.forEach(list => {
            list.style.display = 'none';
        });
    }, [year, month]);


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

    const getData = (querie_year, querie_month) => {
        const url = serverUrl + "/movimiento?anio=" + querie_year + "&mes=" + querie_month;
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

                    setEarnings(data.ganancia);

                    //Set list
                    setIngresosEsporadicos(data.ingresos.esporadicos.map(ingreso => {
                        return {
                            ...ingreso,
                            concepto: ingreso.descripcion,
                            cantidad: ingreso.monto,
                        }
                    }));

                    setGastosEsporadicos(data.gastos.esporadicos.map(gasto => {
                        return {
                            ...gasto,
                            concepto: gasto.descripcion,
                            cantidad: gasto.monto
                        }
                    }));

                    setIngresosFijos(data.ingresos.fijos.map(ingreso => {
                        return {
                            ...ingreso,
                            concepto: ingreso.observacion,
                            cantidad: ingreso.monto
                        }
                    }));

                    setGastosFijos(data.gastos.fijos.map(gasto => {
                        return {
                            ...gasto,
                            concepto: gasto.deber.descripcion,
                            cantidad: gasto.monto
                        }
                    }));
                } else {
                    console.log(data);
                }

            })
    }

    


    const downloadJsonData = async () => {
        //fetch data
        const url = serverUrl + "/movimiento?anio=" + year + "&mes=" + month;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const data = await response.json();

        //create a blob with the data
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        //create a url for the blob
        const urlBlob = URL.createObjectURL(blob);

        //create a link element
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = 'resumen.json';

        //click the link
        link.click();

        //remove the url
        URL.revokeObjectURL(urlBlob);
    }

        

    return (
        <div className="main-container">
            <h1 className='h1-resumen'>
                Resumen
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'}}>
                <button className='export-button hideMobile' onClick={() => {
                    downloadJsonData();
                }}
                >Exportar</button>
                <div className='change-year'>
                    <button className='change-year-button' onClick={() => setYear(year - 1)}>{'<'}</button>
                    <div className='year'>{year}</div>
                    <button className='change-year-button' onClick={() => setYear(year + 1)}>{'>'}</button>
                </div>
                <div className='change-year'>
                    <button className='change-year-button' onClick={monthSubstract}>{'<'}</button>
                    <div className='month'>{month}</div>
                    <button className='change-year-button' onClick={monthAdd}>{'>'}</button>
                </div>
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
                                    <li key={index} style={{position: 'relative'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                                            <h4>{ingreso.concepto}</h4>
                                            <p
                                                style={{ color: 'gray', fontSize: '0.7rem', paddingTop: '0.5rem' }}
                                            >{new Date(ingreso.fecha).toLocaleDateString()} : {ingreso.detalle_pago}</p>
                                        </div>
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
                                        <div>
                                            <h4>{gasto.concepto}</h4>
                                            <p
                                                style={{ color: 'gray', fontSize: '0.7rem', paddingTop: '0.5rem' }}
                                            >{new Date(gasto.fecha).toLocaleDateString()} : {gasto.detalle_pago}</p>
                                        </div>
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
                                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                                return (
                                    <li key={index}>
                                        <div>
                                            <h4>{ingreso.concepto}</h4>
                                            <p
                                                style={{ color: 'gray', fontSize: '0.7rem', paddingTop: '0.5rem' }}
                                            >{ingreso.cliente.nombre} - {new Date(ingreso.fecha_pago).toISOString().split('T')[0]} -{ingreso.cliente.sede} ({meses[parseInt(new Date(ingreso.fecha).toISOString().split('-')[1]) - 1]})
                                            </p>
                                        </div>
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
                                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                                return (
                                    <li key={index}>
                                        <div>
                                            <h4>{gasto.concepto}</h4>
                                            <p
                                                style={{ color: 'gray', fontSize: '0.7rem', paddingTop: '0.5rem' }}
                                            >{gasto.deber.detalle} - {new Date(gasto.fecha_pago).toLocaleDateString()} -{gasto.deber.descripcion} ({meses[parseInt(new Date(gasto.fecha).toLocaleDateString().split('/')[1] - 1)]})
                                            </p>
                                        </div>
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
            </div>

        </div>
    );
}

export default Resumen;