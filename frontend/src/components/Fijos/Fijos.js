import './Fijos.css';
import { useEffect, useState } from 'react';


function Fijos() {
    const [year, setYear] = useState(0);
    const [iteratorMonth, setIteratorMonth] = useState(0);
    const [type, setType] = useState('Ingresos');
    const [clientes, setClientes] = useState([]);
    //const [deberes, setDeberes] = useState([]);
    const [enabled, setEnabled] = useState(false);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


    useEffect(() => {
        getClients(year);
    }, [year]);

    useEffect(() => {
        setIteratorMonth(thisMonth - (thisMonth % 3));
    }, [thisMonth]);

    useEffect(() => {
        setYear(thisYear);
    }, [thisYear]);

    const advanceMonth = () => {
        setIteratorMonth(iteratorMonth + 3);
        if (iteratorMonth >= 9) {
            setIteratorMonth(0);
            setYear(year + 1);
        }
    }

    const backMonth = () => {
        setIteratorMonth(iteratorMonth - 3);
        if (iteratorMonth < 3) {
            setIteratorMonth(9);
            setYear(year - 1);
        }
    }

    const getClients = (year) => {
        const url = 'http://localhost:5000/cliente'
        const queryParameters = `?year=${year}`

        fetch(url + queryParameters, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })  
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const clientes = data.clientes;
                /*Example data.clientes value
                [
                    {
                        "borne": 756,
                        "caja": 971,
                        "direccion": "m2md6e",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "09ef423e-2625-4779-a575-ac99e434d7ab",
                        "iptv": 984,
                        "login": "rgbxq",
                        "monto": 786,
                        "nombre": "fqrqzg",
                        "pagos": [],
                        "paquete": "biz79h",
                        "sede": "y9c8e7",
                        "status": true,
                        "telefono": "w8juf"
                    },
                    {
                        "borne": 818,
                        "caja": 580,
                        "direccion": "q7x3tt",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "70239204-92fe-41e5-8474-84e2595d2f99",
                        "iptv": 512,
                        "login": "y6usgl",
                        "monto": 561,
                        "nombre": "bc34q",
                        "pagos": [],
                        "paquete": "altn5m",
                        "sede": "nlyxdq",
                        "status": true,
                        "telefono": "ghgl6"
                    },
                    {
                        "borne": 61,
                        "caja": 315,
                        "direccion": "fkkpq",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "8d99f433-f458-404e-b11f-2aa9c4b11de3",
                        "iptv": 844,
                        "login": "nvds",
                        "monto": 408,
                        "nombre": "ikv4n",
                        "pagos": [],
                        "paquete": "r9wrbg",
                        "sede": "t3tjd",
                        "status": true,
                        "telefono": "s95g0s"
                    },
                    {
                        "borne": 627,
                        "caja": 473,
                        "direccion": "1ljpjg",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "0adf6228-7412-4ac7-979f-c5d08a9ad955",
                        "iptv": 750,
                        "login": "cmex0r",
                        "monto": 197,
                        "nombre": "996wq6",
                        "pagos": [],
                        "paquete": "1gruuj",
                        "sede": "12pu8t",
                        "status": true,
                        "telefono": "tlaqwf"
                    },
                    {
                        "borne": 188,
                        "caja": 987,
                        "direccion": "03zqad",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "84106cba-0cd4-480a-925e-371c4c706f0f",
                        "iptv": 686,
                        "login": "f4a585",
                        "monto": 261,
                        "nombre": "v915is",
                        "pagos": [],
                        "paquete": "qubcd",
                        "sede": "5axlo7",
                        "status": true,
                        "telefono": "kzwti"
                    },
                    {
                        "borne": 797,
                        "caja": 908,
                        "direccion": "ja76o",
                        "fecha_instalacion": "Thu, 01 Feb 2024 00:00:00 GMT",
                        "id": "0d5b762e-8875-4f4c-8dde-a47c51cd8ab3",
                        "iptv": 292,
                        "login": "avkejf",
                        "monto": 374,
                        "nombre": "3s5nc",
                        "pagos": [],
                        "paquete": "5rtu8d",
                        "sede": "m3lz38",
                        "status": true,
                        "telefono": "v09gyp"
                    }
                    ]

                Atributos importantes:
                - nombre: Nombre del cliente
                - telefono: Telefono del cliente
                - montos: Monto a pagar
                */
                
                //crear una lista de pagos por cliente
                //si en el indice i no hay pagos, se pone un None
                clientes.forEach(cliente => {
                    const pagos = Array(12).fill(null);
                    cliente.pagos.forEach(pago => {
                        const fecha = new Date(pago.fecha);
                        const mes = fecha.getMonth();
                        pagos[mes] = pago.monto;
                    });
                    cliente.pagos = pagos;
                });

                console.log(clientes);
                setClientes(clientes);
            }
        })
        .catch(error => console.log(error));
    }

    const createClient = () => {
        const url = 'http://localhost:5000/cliente'

        let datain = {}
        const campos = ['nombre', 'telefono', 'direccion', 'fecha_instalacion', 'sede', 'paquete', 'login', 'caja', 'borne', 'status', 'monto', 'iptv']

        for (let campo of campos) {
            //generar aleatorio
            datain[campo] = Math.random().toString(36).substring(7);
        }

        datain['fecha_instalacion'] = '2024-02-01'
        datain['status'] = 'True'

        const camposNumericos = ['monto', 'iptv', 'caja', 'borne']

        for (let campo of camposNumericos) {
            datain[campo] = Math.floor(Math.random() * 1000);
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(datain)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                getClients(year);
            } else {
                console.log(data);
            }
        })
        .catch(error => console.log(error));
    }

    return (
        <div className='main-container'>
            <h1 className='h1-fijos'>
                Fijos
                <div className='toogle-switch-container'>
                    <div className='toogle-switch'>
                        <label className={`toogle-switch-label ${!enabled ? "label-enabled" : "label-disabled"}`}
                            onClick={() => {
                                setEnabled(false);
                                setType('Ingresos');
                            }}>
                            Ingresos
                        </label>

                        <div className={`toogle-switch-button ${enabled ? "button-enabled" : "button-disabled"}`} 
                            onClick={() => {
                                setEnabled(!enabled);
                                setType(type === 'Ingresos' ? 'Gastos' : 'Ingresos');
                            }}>
                            <div className={`toogle-switch-ball ${enabled ? "ball-enabled" : "ball-disabled"}`}></div>
                        </div>

                        <label className={`toogle-switch-label ${enabled ? "label-enabled" : "label-disabled"}`}
                            onClick={() => {
                                setEnabled(true);
                                setType('Gastos');
                            }}>
                            Gastos
                        </label>
                    </div>
                </div>
            </h1>
            { type === 'Ingresos' && (
                <div className='fijos-container'>
                    <h2>
                        Ingresos {year}
                        <button className='arrow-button' onClick={backMonth}>{'<'}</button>
                        <button className='arrow-button' onClick={advanceMonth}>{'>'}</button>
                        <button className='add-button' onClick={createClient}>+</button>
                    </h2>
                    <div className='months-header'>
                        <div className={`month ${iteratorMonth === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth]}</div>
                        <div className={`month ${iteratorMonth + 1 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 1]}</div>
                        <div className={`month ${iteratorMonth + 2 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 2]}</div>
                    </div>

                    <div className='clients-list-container'>
                        { clientes.map(cliente => (
                            <div className='client-list'>
                                <div className='client-data'>
                                    <div className='client-name'>{cliente.nombre}</div>
                                    <div className='client-description'>{cliente.telefono}</div>
                                    <div className='client-value'>{cliente.monto}</div>
                                </div>
                                <div className='client-months'>
                                    { [0, 1, 2].map(i => {
                                        const luegoDeInscripcion = new Date(cliente.fecha_instalacion).getMonth() === i + iteratorMonth && new Date(cliente.fecha_instalacion).getFullYear() === year;
                                        if (cliente.pagos[i] === null && !(luegoDeInscripcion)) {
                                            // si la fecha es mayor a la actual, se pone un None
                                            if (i + iteratorMonth > thisMonth && year === thisYear
                                                || year > thisYear) {
                                                return <div className='client-month'></div>
                                            }
                                            return <div className='client-month pending-month'>Pendiente</div>
                                        } else { 
                                            return <div className='client-month'>{cliente.pagos[i]}</div>
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            { type === 'Gastos' && (
                <div className='fijos-container'>
                    <h2>Gastos</h2>
                    <div className='months-header'>
                        <div className='month'>Enero</div>
                        <div className='month actual'>Febrero</div>
                        <div className='month'>Marzo</div>
                    </div>

                    <div className='clients-list-container'>
                        <div className='client-list'>
                            <div className='client-data'>
                                <div className='client-name'>Nombre Cliente</div>
                                <div className='client-description'>Descripcion</div>
                                <div className='client-value'>Valor</div>
                            </div>
                            <div className='client-months'>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                            </div>
                        </div>
                        <div className='client-list'>
                            <div className='client-data'>
                                <div className='client-name'>Nombre Cliente</div>
                                <div className='client-description'>Descripcion</div>
                                <div className='client-value'>Valor</div>
                            </div>
                            <div className='client-months'>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                            </div>
                        </div>
                        <div className='client-list'>
                            <div className='client-data'>
                                <div className='client-name'>Nombre Cliente</div>
                                <div className='client-description'>Descripcion</div>
                                <div className='client-value'>Valor</div>
                            </div>
                            <div className='client-months'>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                            </div>
                        </div>
                        <div className='client-list'>
                            <div className='client-data'>
                                <div className='client-name'>Nombre Cliente</div>
                                <div className='client-description'>Descripcion</div>
                                <div className='client-value'>Valor</div>
                            </div>
                            <div className='client-months'>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                            </div>
                        </div>
                        <div className='client-list'>
                            <div className='client-data'>
                                <div className='client-name'>Nombre Cliente</div>
                                <div className='client-description'>Descripcion</div>
                                <div className='client-value'>Valor</div>
                            </div>
                            <div className='client-months'>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                                <div className='client-month'></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Fijos;