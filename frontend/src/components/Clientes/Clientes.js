import React, { useState, useEffect } from "react";
import "./Clientes.css";
import "./ClientesMobile.css";
import { serverUrl } from "../../utils/config";

function Clientes({ spectator }) {
    // estados ---------------------------------------
    const [filters, setFilters] = useState({
        'nombre': '',
        'telefono': '',
        'sede': '',
        'login': ''
    });

    const [visualizedClients, setVisualizedClients] = useState([]);
    const [clientes, setClientes] = useState([]);


    // ventanas emergentes ---------------------------
    const [showClientData, setShowClientData] = useState(false);
    const [showClientEdit, setShowClientEdit] = useState(false);
    const [clientData, setClientData] = useState({
        'nombre': '',
        'telefono': '',
        'sede': '',
        'login': ''
    });

    // funciones -------------------------------------
    const getClients = () => {
        const url = serverUrl + '/cliente';

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    if (data.message) {
                        alert(data.message);
                    } else if (data.error) {
                        alert(data.error);
                    } else if (data.errors) {
                        alert(data.errors.join('\n'));
                    } else {
                        alert('Error desconocido');
                    }
                    return;
                }
                setClientes(data.clientes);
                console.log(data.clientes);
            })
            .catch(error => alert(error));
    }

    const filter = () => {
        //retorna un arreglo con los clientes que cumplen con los filtros
        //el string de los filtros se convierte a minusculas para que no sea case sensitive
        //el filtro cuestiona que el string esté dentro del string del cliente
        let filteredClients = clientes.filter(cliente => {
            return cliente.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
                cliente.telefono.toLowerCase().includes(filters.telefono.toLowerCase()) &&
                cliente.sede.toLowerCase().includes(filters.sede.toLowerCase()) &&
                cliente.login.toLowerCase().includes(filters.login.toLowerCase());
        });
        setVisualizedClients(filteredClients);
    }

    const showClient = (cliente) => {
        setClientData(cliente);
        setShowClientData(true);
    }

    const showClientEditableWindow = (cliente) => {
        setClientData(cliente);
        setShowClientEdit(true);
    }

    const modificarCliente = (cliente, e) => {
        e.preventDefault();
        const url = serverUrl + `/cliente/${cliente.id}`;

        const copy = { ...cliente };

        // en el form, pasar los datos al copy
        copy.nombre = e.target[0].value;
        copy.telefono = e.target[1].value;
        copy.direccion = e.target[2].value;
        copy.sede = e.target[3].value;
        copy.paquete = e.target[4].value;
        copy.login = e.target[5].value;
        copy.caja = e.target[6].value;
        copy.borne = e.target[7].value;
        copy.monto = e.target[8].value;
        copy.iptv = e.target[9].value;

        // fecha a %Y-%m-%d
        copy.fecha_instalacion = new Date(copy.fecha_instalacion).toISOString().split('T')[0];

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(copy)
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    if (data.message) {
                        alert(data.message);
                    } else if (data.error) {
                        alert(data.error);
                    } else if (data.errors) {
                        alert(data.errors.join('\n'));
                    } else {
                        alert('Error desconocido');
                    }
                    return;
                }
                alert('Cliente modificado exitosamente');
                getClients();
                setShowClientEdit(false);
            })
            .catch(error => alert(error));
    }

    const actDecClient = (cliente, action) => {
        const url = serverUrl + `/cliente/${cliente.id}/${action}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    if (data.message) {
                        alert(data.message);
                    } else if (data.error) {
                        alert(data.error);
                    } else if (data.errors) {
                        alert(data.errors.join('\n'));
                    } else {
                        alert('Error desconocido');
                    }
                    return;
                }
                alert('Cliente activado exitosamente');
                getClients();
            })
            .catch(error => alert(error));
    }


    // efectos ---------------------------------------
    useEffect(() => {
        filter();
        // eslint-disable-next-line
    }, [filters, clientes]);

    useEffect(() => {
        getClients();
    }, []);

    return (
        <div className="main-container">
            <h1>Gestionar Clientes</h1>
            <div className="clientes-container">
                <div className="clientes-searcher">
                    <h3 className="hideMobile">Buscar por:</h3>
                    <input type="text" placeholder="nombre del cliente" onChange={(e) => setFilters({ ...filters, 'nombre': e.target.value })} />
                    <input type="text" placeholder="telefono" onChange={(e) => setFilters({ ...filters, 'telefono': e.target.value })} />
                    <input type="text" placeholder="sede" onChange={(e) => setFilters({ ...filters, 'sede': e.target.value })} />
                    <input type="text" placeholder="login" onChange={(e) => setFilters({ ...filters, 'login': e.target.value })} />
                </div>
                {/* por cada cliente hay un botón para ver sus datos y un botón para editar */}
                <div className="clientes-list">
                    {visualizedClients.map((cliente) => (
                        <div key={cliente.id} className="cliente-card">
                            <div className={`cliente-info ${cliente.status ? 'active' : 'inactive'}`}>
                                <h2>
                                    {cliente.nombre}
                                    <button 
                                        className="status-btn"
                                        onClick={ cliente.status ? () => actDecClient(cliente, 'desactivar') : () => actDecClient(cliente, 'activar') }
                                    >{cliente.status ? 'Desactivar' : 'Activar'}</button>
                                </h2>
                                <div className="cliente-data">
                                    <p>Telefono: {cliente.telefono}</p>
                                    <p>Sede: {cliente.sede}</p>
                                    <p>Login: {cliente.login}</p>
                                </div>
                                
                                <div className="cliente-buttons">
                                    <button onClick={() => showClient(cliente)} className="ver-btn">Ver</button>
                                    { !spectator  && <button onClick={() => showClientEditableWindow(cliente)} className="editar-btn">Editar</button> }
                                </div>
                            </div>
                        </div>
                    ))} 

                    {visualizedClients.length === 0 && <h2 className="notFound">No se encontraron clientes</h2>}
                </div>
            </div>

            {/* ventanas emergentes */}

            {/* client view */}
            <div className={"floating-window-container" + (showClientData ? " floating-window-container-visible" : "")}>
                <div className="floating-window">
                    <div className="floating-window-header">
                        <h2>Informacion del Cliente</h2>
                        <button onClick={() => setShowClientData(false)} className="close-button">X</button>
                    </div>
                    <div className="floating-window-content">
                        <p>Nombre: {clientData.nombre}</p>
                        <p>Telefono: {clientData.telefono}</p>
                        <p>Direccion: {clientData.direccion}</p>
                        <p>Fecha de instalacion: {
                            new Date(clientData.fecha_instalacion).toLocaleDateString()
                        }</p>
                        <p>Sede: {clientData.sede}</p>
                        <p>Paquete: {clientData.paquete}</p>
                        <p>Login: {clientData.login}</p>
                        <p>Caja: {clientData.caja}</p>
                        <p>Borne: {clientData.borne}</p>
                        <p>Status: {clientData.status ? 'Activo' : 'Inactivo'}</p>
                        <p>Monto: {clientData.monto}</p>
                        <p>IPTV: {clientData.iptv}</p>
                    </div>
                </div>
            </div>

            {/* client edit */}
            <div className={"floating-window-container" + (showClientEdit ? " floating-window-container-visible" : "")}>
                <div className="floating-window">
                    <div className="floating-window-header">
                        <h2>Editar Cliente</h2>
                        <button onClick={() => setShowClientEdit(false)} className="close-button">X</button>
                    </div>
                    <form className="floating-window-content" onSubmit={(e) => {
                        modificarCliente(clientData, e);
                    }}>
                        <label>Nombre</label>
                        <input type="text" placeholder="Nombre" value={clientData.nombre} onChange={(e) => setClientData({ ...clientData, 'nombre': e.target.value })} />
                        <label>Telefono</label>
                        <input type="text" placeholder="Telefono" value={clientData.telefono} onChange={(e) => setClientData({ ...clientData, 'telefono': e.target.value })} />
                        <label>Direccion</label>
                        <input type="text" placeholder="Direccion" value={clientData.direccion} onChange={(e) => setClientData({ ...clientData, 'direccion': e.target.value })} />
                        <label>Sede</label>
                        <input type="text" placeholder="Sede" value={clientData.sede} onChange={(e) => setClientData({ ...clientData, 'sede': e.target.value })} />
                        <label>Paquete</label>
                        <input type="text" placeholder="Paquete" value={clientData.paquete} onChange={(e) => setClientData({ ...clientData, 'paquete': e.target.value })} />
                        <label>Login</label>
                        <input type="text" placeholder="Login" value={clientData.login} onChange={(e) => setClientData({ ...clientData, 'login': e.target.value })} />
                        <label>Caja</label>
                        <input type="text" placeholder="Caja" value={clientData.caja} onChange={(e) => setClientData({ ...clientData, 'caja': e.target.value })} />
                        <label>Borne</label>
                        <input type="text" placeholder="Borne" value={clientData.borne} onChange={(e) => setClientData({ ...clientData, 'borne': e.target.value })} />
                        <label>Monto</label>
                        <input type="text" placeholder="Monto" value={clientData.monto} onChange={(e) => setClientData({ ...clientData, 'monto': e.target.value })} />
                        <label>IPTV</label>
                        <input type="text" placeholder="IPTV" value={clientData.iptv} onChange={(e) => setClientData({ ...clientData, 'iptv': e.target.value })} />
                        <button type="submit">Guardar</button>
                    </form>
                </div>
            </div> 
        </div>
    );
}

export default Clientes
