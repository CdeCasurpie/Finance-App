import './Fijos.css';
import { useEffect, useState } from 'react';


function Fijos({spectator}) {
    //Variables de estado -------------------------------
    const [year, setYear] = useState(new Date().getFullYear()); //año actual
    const [iteratorMonth, setIteratorMonth] = useState(0); //mes actual inicial visible
    const [type, setType] = useState('Ingresos');
    const [errors, setErrors] = useState([]); //errores lista
    const [enabled, setEnabled] = useState(false); // false = Ingresos, true = Gastos
    


    //Datos de la API -----------------------------------
    //clientes: lista de clientes con sus pagos
    const [clientes, setClientes] = useState([]);
    const [newPagoData, setNewPagoData] = useState({}); //datos del nuevo pago a registrar
    //deberes: lista de deberes que debe pagar el usuario
    const [deberes, setDeberes] = useState([]);
    const [newDeberData, setNewDeberData] = useState({}); //datos del nuevo deber a registrar

 
    //ventanas emergentes --------------------------------
    //forms para ingresos
    const [createClientForm, setVisibleCreateClient] = useState(false); //estado del formulario de creacion de cliente
    const [registerPagoForm, setVisibleRegisterPago] = useState(false); //estado del formulario de registro de pago
    //forms para gastos
    const [createDeberForm, setVisibleCreateDeber] = useState(false); //estado del formulario de creacion de gasto
    const [registerGastoForm, setVisibleRegisterGasto] = useState(false); //estado del formulario de registro de gasto
    

    //iterator month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


    //Logic

    useEffect(() => {
        getClients(year);
        getDeberes(year);
    }, [year]);

    useEffect(() => {
        setIteratorMonth(thisMonth - (thisMonth % 3));
    }, [thisMonth]);

    useEffect(() => {
        setYear(thisYear);
    }, [thisYear]);


    //Funciones -----------------------------------------
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
                /*
                Atributos importantes:
                - nombre: Nombre del cliente
                - telefono: Telefono del cliente
                - montos: Monto a pagar
                */
                
                //crear una lista de pagos por cliente
                //si en el indice i no hay pagos, se pone un None
                clientes.forEach(cliente => {
                    let pagos = Array(12).fill(null);
                    cliente.pagos.forEach(pago => {
                        const fecha = new Date(pago.fecha);
                        const mes = fecha.getMonth();
                        pagos[mes] = pago;
                    });
                    cliente.pagos = pagos;
                });

                while(clientes.length < 5) {
                    clientes.push({
                        nombre: '',
                        telefono: '',
                        monto: null,
                        pagos: []
                    });
                }

                setClientes(clientes);
            }
        })
        .catch(error => console.log(error));
    }

    const createClient = (evenet) => {
        evenet.preventDefault();

        const url = 'http://localhost:5000/cliente'


        const form = evenet.target;
        const datain = {};
        const campos = ['nombre', 'telefono', 'direccion', 'fecha_instalacion', 'sede', 'paquete', 'login', 'caja', 'borne', 'status', 'monto', 'iptv'];

        for (let campo of campos) {
            datain[campo] = form[campo].value;
        }

        datain['status'] = true;

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
                setVisibleCreateClient(false);
                form.reset();
            } else {
                console.log(data);
            }
        })
        .catch(error => console.log(error));
    }

    const showPagoForm = (cliente, mes, anio) => {
        setNewPagoData({
            cliente_id: cliente.id,
            fecha: new Date(anio, mes, 1)
        });
        setVisibleRegisterPago(true);
    }

    const createPago = (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/movimiento/fijo/ingreso'

        const form = event.target;
        const datain = {};
        const campos = ['numero_operacion', 'observacion', 'fecha', 'monto'];

        for (let campo of campos) {
            datain[campo] = form[campo].value;
        }

        datain.cliente_id = newPagoData.cliente_id;
        //fecha a YYYY-MM-DD
        datain.fecha = newPagoData.fecha.getFullYear() + '-' + newPagoData.fecha.getMonth().toString().padStart(2, '0') + '-' + datain.fecha.toString().padStart(2, '0');
        datain.monto = parseFloat(datain.monto);

        //verificar que la fecha sea real , osea que febrero no tenga 30 dias
        if (datain.fecha.split('-')[2] > 28 && datain.fecha.split('-')[1] == 2) {
            setErrors(['Fecha invalida: Febrero solo tiene 28 dias']);
        } else if (datain.fecha.split('-')[2] > 30 && [4, 6, 9, 11].includes(parseInt(datain.fecha.split('-')[1]))) {
            setErrors(['Fecha invalida: Este mes solo tiene 30 dias']);
        } else {
            setErrors([]);
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
                    setVisibleRegisterPago(false);
                    form.reset();
                    setErrors([]);
                } else {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors([data.message]);
                    } else {
                        setErrors(['Error desconocido']);
                    }
                }
            })
        }
    }

    const getDeberes = (year) => {
        const url = 'http://localhost:5000/deber'
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
                const deberes = data.deberes;

                deberes.forEach(deber => {
                    let pagos = Array(12).fill(null);
                    deber.pagos.forEach(pago => {
                        const fecha = new Date(pago.fecha);
                        const mes = fecha.getMonth();
                        pagos[mes] = pago;
                    });
                    deber.pagos = pagos;
                });

                while(deberes.length < 5) {
                    deberes.push({
                        detalle: '',
                        descripcion: '',
                        fecha_inicio: '',
                        repeticion: null,
                        pagos: []
                    });
                }

                setDeberes(deberes);
            }
        })
    }

    const createDeber = (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/deber'

        const form = event.target;
        const datain = {};
        const campos = ['detalle', 'descripcion', 'fecha_inicio', 'repeticion']

        for (let campo of campos) {
            datain[campo] = form[campo].value;
        }

        datain.repeticion = parseInt(datain.repeticion);

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
                getDeberes(year);
                setVisibleCreateDeber(false);
                form.reset();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors([data.message]);
                } else {
                    setErrors(['Error desconocido']);
                }
            }
        })
    }

    const showGastoForm = (deber, mes, anio) => {
        setNewPagoData({
            deber_id: deber.id,
            fecha: new Date(anio, mes, 1)
        });
        setVisibleRegisterGasto(true);
        console.log(newPagoData);
    }

    const createGasto = (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/movimiento/fijo/gasto'

        const form = event.target;
        const datain = {};
        const campos = ['numero_operacion', 'observacion', 'fecha', 'monto'];

        for (let campo of campos) {
            datain[campo] = form[campo].value;
        }

        datain.deber_id = newPagoData.deber_id;
        //fecha a YYYY-MM-DD
        datain.fecha = newPagoData.fecha.getFullYear() + '-' + newPagoData.fecha.getMonth().toString().padStart(2, '0') + '-' + datain.fecha.toString().padStart(2, '0');
        datain.monto = parseFloat(datain.monto);

        //verificar que la fecha sea real , osea que febrero no tenga 30 dias
        if (datain.fecha.split('-')[2] > 28 && datain.fecha.split('-')[1] == 2) {
            setErrors(['Fecha invalida: Febrero solo tiene 28 dias']);
        } else if (datain.fecha.split('-')[2] > 30 && [4, 6, 9, 11].includes(parseInt(datain.fecha.split('-')[1]))) {
            setErrors(['Fecha invalida: Este mes solo tiene 30 dias']);
        } else {
            setErrors([]);
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
                    getDeberes(year);
                    setVisibleRegisterGasto(false);
                    form.reset();
                    setErrors([]);
                } else {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors([data.message]);
                    } else {
                        setErrors(['Error desconocido']);
                    }
                }
            })
        }
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
                        { !spectator && (
                            <button className='add-button' onClick={() => setVisibleCreateClient(true)}>+</button>
                        )}
                    </h2>
                    <div className='months-header'>
                        <div className={`month ${iteratorMonth === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth]}</div>
                        <div className={`month ${iteratorMonth + 1 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 1]}</div>
                        <div className={`month ${iteratorMonth + 2 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 2]}</div>
                    </div>

                    <div className='clients-list-container'>
                        { clientes.map(cliente => (
                            <div className='client-list' key={cliente.id}>
                                <div className='client-data'>
                                    <div className='client-name'>{cliente.nombre}</div>
                                    <div className='client-description'>{cliente.telefono}</div>
                                    <div className='client-value'>{cliente.monto}</div>
                                </div>
                                <div className='client-months'>
                                    { [0, 1, 2].map(i => {
                                    
                                        //si se debe mostrar alguna información (despues de inscripcion 
                                        // y antes o igual a hoy) se muestra el pago o pendiente

                                        //si no se debe mostrar, se muestra un espacio en blanco

                                        const yearInScreen = year; //fecha actual
                                        const monthInScreen = iteratorMonth + i;
                                        const inscriptionYear = new Date(cliente.fecha_instalacion).getFullYear(); //fecha de inscripcion
                                        const inscriptionMonth = new Date(cliente.fecha_instalacion).getMonth();
                                        const todaysYear = new Date().getFullYear(); //fecha actual
                                        const todaysMonth = new Date().getMonth();

                                        const despuesDeInscripcion = yearInScreen > inscriptionYear || (yearInScreen === inscriptionYear && monthInScreen >= inscriptionMonth);
                                        const antesOIgualAHoy = yearInScreen < todaysYear || (yearInScreen === todaysYear && monthInScreen <= todaysMonth);

                                        if (despuesDeInscripcion && antesOIgualAHoy) {
                                            if (cliente.pagos[monthInScreen] === null) {
                                                return <div 
                                                className='client-month pending-month' 
                                                onClick={() => {
                                                    if (!spectator) {
                                                        showPagoForm(cliente, monthInScreen + 1, yearInScreen);
                                                    }
                                                }}
                                                key={i}
                                                >
                                                    Pendiente
                                                </div>
                                            } else {
                                                return <div className='client-month client-paied-month' key={i}>
                                                    <p>{cliente.pagos[monthInScreen].observacion}</p>
                                                    <p>{cliente.pagos[monthInScreen].monto}</p>
                                                </div>
                                            }
                                        } else {
                                            return <div className='client-month' key={i}></div>
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
                    <h2>
                        Gastos {year}
                        <button className='arrow-button' onClick={backMonth}>{'<'}</button>
                        <button className='arrow-button' onClick={advanceMonth}>{'>'}</button>
                        { !spectator && (
                            <button className='add-button' onClick={() => setVisibleCreateDeber(true)}>+</button>
                        )}
                    </h2>
                    <div className='months-header'>
                        <div className={`month ${iteratorMonth === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth]}</div>
                        <div className={`month ${iteratorMonth + 1 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 1]}</div>
                        <div className={`month ${iteratorMonth + 2 === thisMonth && year === thisYear ? 'actual' : ''}`}>{months[iteratorMonth + 2]}</div>
                    </div>

                    <div className='clients-list-container'>
                        { deberes.map(deber => (
                            <div className='client-list' key={deber.id}>
                                <div className='client-data'>
                                    <div className='client-name'>{deber.detalle}</div>
                                    <div className='client-description'>{deber.fecha_inicio}</div>
                                    <div className='client-value'>{deber.repeticion}</div>
                                </div>
                                <div className='client-months'>
                                    { [0, 1, 2].map(i => {
                                    
                                        //si se debe mostrar alguna información (despues de inscripcion 
                                        // y antes o igual a hoy) se muestra el pago o pendiente

                                        //si no se debe mostrar, se muestra un espacio en blanco

                                        const yearInScreen = year; //fecha actual
                                        const monthInScreen = iteratorMonth + i;
                                        const inscriptionYear = new Date(deber.fecha_inicio).getFullYear(); //fecha de inscripcion
                                        const inscriptionMonth = new Date(deber.fecha_inicio).getMonth() + 1;
                                        const todaysYear = new Date().getFullYear(); //fecha actual
                                        const todaysMonth = new Date().getMonth();

                                        const despuesDeInscripcion = yearInScreen > inscriptionYear || (yearInScreen === inscriptionYear && monthInScreen >= inscriptionMonth);
                                        const antesOIgualAHoy = yearInScreen < todaysYear || (yearInScreen === todaysYear && monthInScreen <= todaysMonth);

                                        if (despuesDeInscripcion && antesOIgualAHoy) {
                                            if (deber.pagos[monthInScreen] === null) {
                                                return <div 
                                                className='client-month pending-month'
                                                key={i}
                                                onClick={() => {
                                                    if (!spectator) {
                                                        showGastoForm(deber, monthInScreen + 1, yearInScreen);
                                                    }
                                                }}
                                                >
                                                    Pendiente
                                                </div>
                                            } else {
                                                return <div className='client-month client-paied-month' key={i}>
                                                    <p>{deber.pagos[monthInScreen].observacion}</p>
                                                    <p>{deber.pagos[monthInScreen].monto}</p>
                                                </div>
                                            }
                                        } else {
                                            return <div className='client-month' key={i}></div>
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            { /* VENTANAS EMERGENTES --------------------------------- */}

            {createClientForm && (
                <div className="floating-window-container floating-window-container-visible">
                <div className="floating-window">
                    <div className="floating-window-header">
                        <h2>Registrar nuevo Cliente</h2>
                        <button className="cerrarOverlay" onClick={() => setVisibleCreateClient(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={createClient} className="floating-window-content">
                        {/* 'nombre', 'telefono', 'direccion', 'fecha_instalacion', 'sede', 'paquete', 'login', 'caja', 'borne', 'status', 'monto', 'iptv'] */}
                        <div className="campo">
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" placeholder='Nombre' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="telefono">Telefono:</label>
                            <input type="text" id="telefono" placeholder='Telefono' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="direccion">Direccion:</label>
                            <input type="text" id="direccion" placeholder='Direccion' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="fecha_instalacion">Fecha de Instalacion:</label>
                            <input type="date" id="fecha_instalacion" placeholder='Fecha de Instalacion' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="sede">Sede:</label>
                            <input type="text" id="sede" placeholder='Sede' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="paquete">Paquete:</label>
                            <input type="text" id="paquete" placeholder='Paquete' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="login">Login:</label>
                            <input type="text" id="login" placeholder='Login' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="caja">Caja:</label>
                            <input type="number" id="caja" placeholder='Caja' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="borne">Borne:</label>
                            <input type="number" id="borne" placeholder='Borne' required />
                        </div>

                        <div className="campo" style={{display: 'none'}}>
                            <label htmlFor="status">Status:</label>
                            <input type="text" id="status" placeholder='Status' />
                        </div>

                        <div className="campo">
                            <label htmlFor="monto">Monto:</label>
                            <input type="number" id="monto" placeholder='Monto' required />
                        </div>

                        <div className="campo">
                            <label htmlFor="iptv">IPTV:</label>
                            <input type="number" id="iptv" placeholder='IPTV' required />
                        </div>

                        <div className="floating-window-buttons">
                            <button type='submit' className='floating-window-buttons-submit'>Crear Cliente</button>
                            <button
                            onClick={() => setVisibleCreateClient(false)}
                            >Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
            )}

            {registerPagoForm && (
                <div className="floating-window-container floating-window-container-visible">
                    <div className="floating-window">
                        <div className="floating-window-header">
                            <h2>Registrar Pago</h2>
                            <button className="cerrarOverlay" onClick={() => {
                                setVisibleRegisterPago(false);
                                setErrors([]);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </div>
                        <form className="floating-window-content" onSubmit={createPago} id="new-gasto-form">
                            {/* campos = ['numero_operacion', 'observacion', 'fecha', 'monto'] */}
                            <div className="campo">
                                <label htmlFor="numero_operacion">Numero de Operacion:</label>
                                <input type="text" id="numero_operacion" placeholder='Numero de Operacion' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="observacion">Observacion:</label>
                                <input type="text" id="observacion" placeholder='Observacion' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="fecha">Dia del Mes:</label>
                                <input type="number" id="fecha" placeholder={new Date().getDate()} min='1' max='31' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="monto">Monto:</label>
                                <input type="number" id="monto" placeholder='Monto' required />
                            </div>

                            <div>
                                {errors.map(error => (
                                    <div className='error'>{error}</div>
                                ))}
                            </div>

                            <div className="floating-window-buttons">
                                <button type='submit' className='floating-window-buttons-submit'>Registrar Pago</button>
                                <button
                                onClick={() => {
                                    setVisibleRegisterPago(false);
                                    setErrors([]);
                                }}
                                >Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {createDeberForm && ( 
                <div className="floating-window-container floating-window-container-visible">
                    <div className="floating-window">
                        <div className="floating-window-header">
                            <h2>Registrar Nuevo Deber</h2>
                            <button className="cerrarOverlay" onClick={() => setVisibleCreateDeber(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={createDeber} className="floating-window-content">
                            {/* campos = ['detalle', 'descripcion', 'fecha_inicio', 'repeticion'] */}
                            <div className="campo">
                                <label htmlFor="detalle">Detalle:</label>
                                <input type="text" id="detalle" placeholder='Detalle' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="descripcion">Descripcion:</label>
                                <input type="text" id="descripcion" placeholder='Descripcion' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                                <input type="date" id="fecha_inicio" placeholder='Fecha de Inicio' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="repeticion">Repeticion:</label>
                                <input type="number" id="repeticion" placeholder='Repeticion' required />
                            </div>

                            <div>
                                {errors.map(error => (
                                    <div className='error'>{error}</div>
                                ))}
                            </div>

                            <div className="floating-window-buttons">
                                <button type='submit' className='floating-window-buttons-submit'>Crear Deber</button>
                                <button
                                onClick={() => setVisibleCreateDeber(false)}
                                >Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {registerGastoForm && (
                <div className="floating-window-container floating-window-container-visible">
                    <div className="floating-window">
                        <div className="floating-window-header">
                            <h2>Registrar Gasto</h2>
                            <button className="cerrarOverlay" onClick={() => {
                                setVisibleRegisterGasto(false);
                                setErrors([]);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </div>
                        <form className="floating-window-content" onSubmit={createGasto} id="new-gasto-form">
                            {/* campos = ['numero_operacion', 'observacion', 'fecha', 'monto'] */}
                            <div className="campo">
                                <label htmlFor="numero_operacion">Numero de Operacion:</label>
                                <input type="text" id="numero_operacion" placeholder='Numero de Operacion' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="observacion">Observacion:</label>
                                <input type="text" id="observacion" placeholder='Observacion' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="fecha">Dia del Mes:</label>
                                <input type="number" id="fecha" placeholder={new Date().getDate()} min='1' max='31' required />
                            </div>

                            <div className="campo">
                                <label htmlFor="monto">Monto:</label>
                                <input type="number" id="monto" placeholder='Monto' required />
                            </div>

                            <div>
                                {errors.map(error => (
                                    <div className='error'>{error}</div>
                                ))}
                            </div>

                            <div className="floating-window-buttons">
                                <button type='submit' className='floating-window-buttons-submit'>Registrar Gasto</button>
                                <button onClick={() => {
                                    setVisibleRegisterGasto(false);
                                    setErrors([]);
                                }}
                                >Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

        
    );
}

export default Fijos;