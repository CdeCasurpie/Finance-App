import React, { useState, useEffect } from "react";
import "./Clientes.css";
// const clientes = [
/*     {
        'id': self.id,
        'nombre': self.nombre,
        'telefono': self.telefono,
        'direccion': self.direccion,
        'fecha_instalacion': self.fecha_instalacion,
        'sede': self.sede,
        'paquete': self.paquete,
        'login': self.login,
        'caja': self.caja,
        'borne': self.borne,
        'status': self.status,
        'monto': self.monto,
        'iptv': self.iptv
    }
    */
// ];


function Clientes({ spectator }) {
    // estados ---------------------------------------
    const [clientes, setClientes] = useState([]);

    // funciones -------------------------------------
    const getClients = () => {
        setClientes([
            {
                'id': '1334-1234-1234-1234',
                'nombre': 'Juan Perez',
                'telefono': '12345678',
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
            }
        ]);
    }




    // efectos ---------------------------------------
    useEffect(() => {
        getClients();
    }, []);

    return (
        <div className="main-container">
            <h1>Gestionar Clientes</h1>
            <div className="clientes-container">
                <div className="clientes-searcher">
                    <input type="text" placeholder="nombre del cliente" />
                    <input type="text" placeholder="telefono" />
                    <input type="text" placeholder="sede" />
                    <input type="text" placeholder="login" />
                </div>
                {/* por cada cliente hay un botón para ver sus datos y un botón para editar */}
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="cliente-card">
                        <div className={`cliente-info ${cliente.status ? 'active' : 'inactive'}`}>
                            <h2>{cliente.nombre}</h2>
                            <div className="cliente-data">
                                <p>Telefono: {cliente.telefono}</p>
                                <p>Sede: {cliente.sede}</p>
                                <p>Login: {cliente.login}</p>
                            </div>
                            
                            <div className="cliente-buttons">
                                <button onClick={() => spectator(cliente)}>Ver</button>
                                { !spectator  && <button onClick={() => spectator(cliente)}>Editar</button> }
                            </div>

                            {/* botones */}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Clientes
