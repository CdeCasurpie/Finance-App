import './Fijos.css';
import { useState } from 'react';

function Fijos() {

    const selectMonth = (e) => {
        const months = document.querySelectorAll('.month');

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
                <div className='clientes-container'>
                    <h2>Clientes</h2>
                </div>
                <div className='months-container'>
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