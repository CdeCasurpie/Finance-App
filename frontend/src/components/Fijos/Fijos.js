import './Fijos.css';
import { useState } from 'react';


function generateUUID(entero) {
    /* generar en base a un entero */
    if (entero) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (entero + Math.random() * 16) % 16 | 0;
            entero = Math.floor(entero / 16);
            return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
        });
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
}

function generateClient(i) {
    const nombres = ['Juan', 'Pedro', 'Maria', 'Jose', 'Luis', 'Anna', 'Carlos', 'Sofia', 'Andres', 'Laura'];
    const apellidos = ['Perez', 'Gomez', 'Gonzalez', 'Rodriguez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Diaz', 'Torres', 'Canales'];
    return {
        id: generateUUID(i),
        nombre: nombres[Math.floor(Math.random() * nombres.length)] + ' ' + apellidos[Math.floor(Math.random() * apellidos.length)],
        descripcion: Math.random() > 0.9 ? 'Pendiente' : 'Pagado',
        valor: Math.floor(Math.random() * 1000000)
    }
}


const clientes = {
    'Enero': [], 'Febrero': [], 'Marzo': [], 'Abril': [], 'Mayo': [], 'Junio': [], 'Julio': [], 'Agosto': [], 'Septiembre': [], 'Octubre': [], 'Noviembre': [], 'Diciembre': []
};

/* generar 20 clientes por mes */
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
meses.forEach((mes) => {
    for (let i = 0; i < 20; i++) {
        clientes[mes].push(generateClient(i));
    }
    clientes[mes].sort((a, b) => a.descripcion === 'Pendiente' ? -1 : 1);
});

function Fijos() {

    const [month, setMonth] = useState('Enero');
    const [year, setYear] = useState(2024);

    const selectMonth = (e) => {
        const months = document.querySelectorAll('.month');

        setMonth(e.target.innerText);

        months.forEach((m) => {
            m.classList.remove('selected-month');
        });

        e.target.classList.add('selected-month');
    }

    const [enabled, setEnabled] = useState(false);


    return (
        <div className='main-container'>
            <h1 className='h1-fijos'>
                Fijos
                <div className='toogle-switch-container'>
                    <div className='toogle-switch'>
                        <label className={`toogle-switch-label ${!enabled ? "label-enabled" : "label-disabled"}`}
                            onClick={() => setEnabled(false)}>
                            Ingresos
                        </label>

                        <div className={`toogle-switch-button ${enabled ? "button-enabled" : "button-disabled"}`} onClick={() => setEnabled(!enabled)}>
                            <div className={`toogle-switch-ball ${enabled ? "ball-enabled" : "ball-disabled"}`}></div>
                        </div>

                        <label className={`toogle-switch-label ${enabled ? "label-enabled" : "label-disabled"}`}
                            onClick={() => setEnabled(true)}>
                            Gastos
                        </label>
                    </div>
                </div>
            </h1>
            <div className='fijos-container'>
                <div className='left-container'>
                    <h2>Clientes</h2>
                    <div className='clientes-list'>
                        {clientes[month].map((cliente) => {
                            return (
                                <div key={cliente.id} className={`cliente ${cliente.descripcion === 'Pendiente' ? 'cliente-no-pago' : 'cliente-pago'}`}>
                                    <div className='cliente-info'>
                                        <div className='cliente-nombre'>{cliente.nombre}</div>
                                        <div className='cliente-descripcion'>{cliente.descripcion}</div>
                                    </div>
                                    <div className='cliente-valor'>{cliente.valor}</div>
                                </div>
                            );
                        })}
                    </div>
                    <button className='add-cliente-button'>Agregar Cliente</button>
                </div>
                <div className='months-container'>
                    <div className='change-year'>
                        <button className='change-year-button' onClick={() => setYear(year - 1)}>{'<'}</button>
                        <div className='year'>{year}</div>
                        <button className='change-year-button' onClick={() => setYear(year + 1)}>{'>'}</button>
                    </div>
                    <div className='month selected-month' onClick={selectMonth}>Enero</div>
                    <div className='month' onClick={selectMonth}>Febrero</div>
                    <div className='month' onClick={selectMonth}>Marzo</div>
                    <div className='month' onClick={selectMonth}>Abril</div>
                    <div className='month' onClick={selectMonth}>Mayo</div>
                    <div className='month' onClick={selectMonth}>Junio</div>
                    <div className='month' onClick={selectMonth}>Julio</div>
                    <div className='month' onClick={selectMonth}>Agosto</div>
                    <div className='month' onClick={selectMonth}>Septiembre</div>
                    <div className='month' onClick={selectMonth}>Octubre</div>
                    <div className='month' onClick={selectMonth}>Noviembre</div>
                    <div className='month' onClick={selectMonth}>Diciembre</div>
                </div>
            </div>
        </div>
    );
}

export default Fijos;