import React, { useState, useEffect } from "react";
import "./Clientes.css";


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

    // funciones -------------------------------------
    const getClients = () => {
        setClientes([
            {
                'id': '1334-1234-1234-1234',
                'nombre': 'Vicky rosales',
                'telefono': '979100181',
                'direccion': 'Calle 123',
                'fecha_instalacion': '12/12/2021',
                'sede': 'Sede 3',
                'paquete': 'Paquete 1',
                'login': 'juanperez',
                'caja': 'Caja 1',
                'borne': 'Borne 1',
                'status': true,
                'monto': '100',
                'iptv': 'No'
            },
            {
                'id': '1334-1234-1234-1234',
                'nombre': 'Cesar Perales',
                'telefono': '988770244',
                'direccion': 'Calle 123',
                'fecha_instalacion': '12/12/2021',
                'sede': 'Sede 1',
                'paquete': 'Paquete 1',
                'login': 'juanperez',
                'caja': 'Caja 1',
                'borne': 'Borne 1',
                'status': true,
                'monto': '100',
                'iptv': 'No'
            },
            {
                'id': '1334-1234-1234-1234',
                'nombre': 'Melisa Rivera',
                'telefono': '977135498',
                'direccion': 'Calle 123',
                'fecha_instalacion': '12/12/2021',
                'sede': 'Sede 2',
                'paquete': 'Paquete 1',
                'login': 'juanperez',
                'caja': 'Caja 1',
                'borne': 'Borne 1',
                'status': true,
                'monto': '100',
                'iptv': 'No'
            }
        ]);
        setVisualizedClients(clientes);
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




    // efectos ---------------------------------------
    useEffect(() => {
        getClients();
    }, []);

    useEffect(() => {
        filter();
    }, [filters]);

    return (
        <div className="main-container">
            <h1>Gestionar Clientes</h1>
            <div className="clientes-container">
                <div className="clientes-searcher">
                    <h3>Buscar por:</h3>
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
                                <h2>{cliente.nombre}</h2>
                                <div className="cliente-data">
                                    <p>Telefono: {cliente.telefono}</p>
                                    <p>Sede: {cliente.sede}</p>
                                    <p>Login: {cliente.login}</p>
                                </div>
                                
                                <div className="cliente-buttons">
                                    <button onClick={() => spectator(cliente)} className="ver-btn">Ver</button>
                                    { !spectator  && <button onClick={() => spectator(cliente)} className="editar-btn">Editar</button> }
                                </div>
                            </div>
                        </div>
                    ))} 
                </div>
            </div>
        </div>
    );
}

export default Clientes
