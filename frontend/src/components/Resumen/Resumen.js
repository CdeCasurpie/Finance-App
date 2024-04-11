import './Resumen.css';

function Resumen() {

    const ingresosEsporadicos = [
        {
            concepto: 'Venta de ropa',
            cantidad: 200
        },
        {
            concepto: 'Venta de zapatos',
            cantidad: 100
        },
        {
            concepto: 'Venta de accesorios',
            cantidad: 50
        },
        {
            concepto: 'Venta de bolsas',
            cantidad: 50
        },
        {
            concepto: 'Venta de zapatos',
            cantidad: 100
        },
        {
            concepto: 'Venta de accesorios',
            cantidad: 50
        },
        {
            concepto: 'Venta de bolsas',
            cantidad: 50
        },
        {
            concepto: 'Venta de zapatos',
            cantidad: 100
        },
        {
            concepto: 'Venta de accesorios',
            cantidad: 50
        },
        {
            concepto: 'Venta de bolsas',
            cantidad: 50
        },
        {
            concepto: 'Venta de zapatos',
            cantidad: 100
        },
        {
            concepto: 'Venta de accesorios',
            cantidad: 50
        },
        {
            concepto: 'Venta de bolsas',
            cantidad: 50
        }
    ];

    const gastosEsporadicos = [
        {
            concepto: 'Compra de ropa',
            cantidad: 50
        },
        {
            concepto: 'Compra de zapatos',
            cantidad: 50
        },
        {
            concepto: 'Compra de zapatos',
            cantidad: 50
        },
        {
            concepto: 'Compra de zapatos',
            cantidad: 50
        },
        {
            concepto: 'Compra de zapatos',
            cantidad: 50
        }
    ];

    const displayList = (e) => {
        let list = e.target.parentElement.nextElementSibling;
        let display = list.style.display;
        
        e.target.classList.toggle('rotation-180');

        if(display === 'none' || display === ''){
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
        }
    }

    return (
        <div className="main-container">
            <h1>Resumen</h1>
            <div className="resumen-container">
                <div className='sub-card esporadicos'>
                    <h2>Esporádicos</h2>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Ingresos Esporádicos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-esporadicos'>$300</h3>
                        </div>
                        <ul style={{display: 'none'}}>
                            {ingresosEsporadicos.map((ingreso, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{ingreso.concepto}</h4>
                                        <p>${ingreso.cantidad}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className='list-card'>
                        <div className='list-card-header'>
                            <button className='display-button' onClick={displayList}>▲</button>
                            <h3>Gastos Esporádicos: </h3>
                            <h3 className='total-list-card' id='total-ingresos-esporadicos'>$100</h3>
                        </div>
                        <ul style={{display: 'none'}}>
                            {gastosEsporadicos.map((gasto, index) => {
                                return (
                                    <li key={index}>
                                        <h4>{gasto.concepto}</h4>
                                        <p>${gasto.cantidad}</p>
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
                            <h3 className='total-list-card' id='total-ingresos-fijos'>$300</h3>
                        </div>
                        <ul style={{display: 'none'}}>
                            <li>
                                <h4>Salario</h4>
                                <p>$300</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sub-card resumen-total">
                    <h2>Ganancias: $300</h2>
                </div>
            </div>
            
        </div>
    );
}

export default Resumen;