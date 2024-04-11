from flask import Flask, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from uuid import uuid4
from sqlalchemy import Date
from flask_cors import CORS

# INICIALIZACIÓN DE LA APLICACIÓN ========================================================================================

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = 'esternocleidomastoideo'

jwt = JWTManager(app)

# Configuración de CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# MODELOS ================================================================================================================
class User(db.Model):
    __name__ = 'user'

    id = db.Column(db.String(50), default=lambda: str(uuid4()), primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    telefono = db.Column(db.String(50))

    def check_password(self, password):
        return self.password == password

class Cliente(db.Model):
    __name__ = 'cliente'

    id = db.Column(db.String(50), primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    telefono = db.Column(db.String(50), nullable=False)
    direccion = db.Column(db.String(50), nullable=False)
    fecha_instalacion = db.Column(Date, nullable=False)
    sede = db.Column(db.String(50), nullable=False)
    paquete = db.Column(db.String(50), nullable=False)
    login = db.Column(db.String(50), nullable=False, unique=True)
    caja = db.Column(db.Integer, nullable=False)
    borne = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    monto = db.Column(db.Float, nullable=False)
    iptv = db.Column(db.Integer, nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
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

class Deber(db.Model):
    __name__ = 'deber'

    id = db.Column(db.String(50), primary_key=True)
    detalle = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200), nullable=False)
    fecha_inicio = db.Column(Date, nullable=False)
    repeticion = db.Column(db.String(50), nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'detalle': self.detalle,
            'descripcion': self.descripcion,
            'fecha_inicio': self.fecha_inicio,
            'repeticion': self.repeticion
        }

class Movimiento(db.Model): #clase padre -> ingresos o gastos
    __name__ = 'movimiento'

    id = db.Column(db.String(50), primary_key=True)
    fecha = db.Column(Date, nullable=False)
    monto = db.Column(db.Float, nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'fecha': self.fecha,
            'monto': self.monto
        }

class Fijo(db.Model):
    __name__ = 'fijo'

    id = db.Column(db.String(50), db.ForeignKey('movimiento.id'), primary_key=True)
    numero_operacion = db.Column(db.String(50), nullable=False)
    observacion = db.Column(db.String(100), nullable=False)

    user_id = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    movimiento = db.relationship('Movimiento', backref='fijo', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'numero_operacion': self.numero_operacion,
            'observacion': self.observacion,
            'fecha': self.movimiento.fecha,
            'monto': self.movimiento.monto
        }


class Esporadico(db.Model):
    __name__ = 'esporadico'

    id = db.Column(db.String(50), db.ForeignKey('movimiento.id'), primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.String(100), nullable=False)
    detalle_pago = db.Column(db.String(100), nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    movimiento = db.relationship('Movimiento', backref='esporadico', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'descripcion': self.descripcion,
            'detalle_pago': self.detalle_pago,
            'fecha': self.movimiento.fecha,
            'monto': self.movimiento.monto
        }

class IngresoFijo(db.Model):
    __name__ = 'ingreso_fijo'

    id = db.Column(db.String(50), db.ForeignKey('fijo.id'), primary_key=True)
    cliente_id = db.Column(db.String(50), db.ForeignKey('cliente.id'), nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)


    fijo = db.relationship('Fijo', backref='ingreso_fijo', uselist=False)
    cliente = db.relationship('Cliente', backref='ingreso_fijo', uselist=False)
    

    def serialize(self):
        return {
            'id': self.id,
            'cliente': self.cliente.serialize(),
            'fecha': self.fijo.movimiento.fecha,
            'monto': self.fijo.movimiento.monto,
            'numero_operacion': self.fijo.numero_operacion,
            'observacion': self.fijo.observacion
        }

class GastoFijo(db.Model):
    __name__ = 'gasto_fijo'

    id = db.Column(db.String(50), db.ForeignKey('fijo.id'), primary_key=True)
    deber_id = db.Column(db.String(50), db.ForeignKey('deber.id'), nullable=False)

    user = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)

    fijo = db.relationship('Fijo', backref='gasto_fijo', uselist=False)
    deber = db.relationship('Deber', backref='gasto_fijo', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'deber': self.deber.serialize(),
            'fecha': self.fijo.movimiento.fecha,
            'monto': self.fijo.movimiento.monto,
            'numero_operacion': self.fijo.numero_operacion,
            'observacion': self.fijo.observacion
        }
        


'''
Diagrama de clases
Movimiento:
    -> Fijo:
        -> IngresoFijo --(Genera)--> Cliente
        -> GastoFijo   --(Genera)--> Deber
    -> Esporadico
    
'''

with app.app_context():
    db.create_all()


# UTILIDADES =============================================================================================================

def getUser():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(id=current_user).first()
    except Exception as e:
        if e == 'Signature has expired':
            return jsonify({'success': False, 'message': 'Token expirado'}), 401
        else:
            return jsonify({'success': False, 'message': 'Token inválido'}), 401
    return user


def verificar_JSON(data, campos):
    errors = []
    for campo in campos:
        if campo not in data:
            errors.append(f'El campo {campo} es requerido')
    return errors

def basicError(errors):
    return jsonify({'success': False, 'errors': errors}), 400


# RUTAS =================================================================================================================
@app.route('/')
def index():
    return jsonify({'success': True, 'message': 'Bienvenido a la API de gestión de ingresos y gastos. Para la documentación de la API, visite la URL /docs'}), 200


# RUTAS DE AUTENTICACIÓN ................................................................................................

@app.route('/login', methods=['POST'])
def login():
    errors = []

    try:
        data = request.get_json()
    except:
        return jsonify({'success': False, 'message': 'Se esperaba un JSON con "email" y "password"'}), 400
    
    try:
        if 'email' in data:
            email = data['email']
        else:
            errors.append('El email es requerido')
        
        if 'password' in data:
            password = data['password']
        else:
            errors.append('La "password" es requerida')

        if len(errors) > 0:
            return basicError(errors)
        
        user = User.query.filter_by(email=email).first()

        if user is None:
            return jsonify({'success': False, 'errors': ['Usuario no encontrado']}), 400
        if user.check_password(password):
            return jsonify({
                'success': True,
                'message': 'Inicio de sesión exitoso',
                'access_token': create_access_token(identity=user.id)
            })
        else:
            return jsonify({'success': False, 'errors': ['Contraseña incorrecta']}), 400
    except:
        abort(500)


@app.route('/register', methods=['POST'])
def register():
    errors = []
    if request.method == 'POST':
        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con "email", "password" y/o "telefono"'}), 400
        
        try:
            if 'email' in data:
                email = data['email']
            else:
                errors.append('El email es requerido')
            
            if 'password' in data:
                password = data['password']
            else:
                errors.append('La "password" es requerida')

            if len(errors) > 0:
                return basicError(errors)
            
            user_temp = User.query.filter_by(email=email).first()
            if user_temp is not None:
                return jsonify({'success': False, 'errors': ['El email ya está registrado']}), 400
            
            try:
                user = User(email=email, password=password, telefono=data['telefono'] if 'telefono' in data else None)
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                print(e)
                db.session.rollback()
                return jsonify({'success': False, 'message': 'Error al registrar el usuario'}), 500
               
            return jsonify({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'access_token': create_access_token(identity=user.id)
            })
        except Exception as e:
            print(e)
            abort(500)
    pass


# RUTAS DE GESTIÓN DE CLIENTES .........................................................................................
@jwt_required()
@app.route('/cliente', methods=['GET'])
def get_clientes():
    try:
        user = getUser()

        # clientes ordenados por status
        clientes = Cliente.query.filter_by(user=user.id).order_by(Cliente.status).all()

        clientes = [cliente.serialize() for cliente in clientes]

        return jsonify({'success': True, 'clientes': clientes})
    except:
        abort(500)


@jwt_required()
@app.route('/cliente', methods=['POST'])
def add_cliente():
    campos = ['nombre', 'telefono', 'direccion', 'fecha_instalacion', 'sede', 'paquete', 'login', 'caja', 'borne', 'status', 'monto', 'iptv']

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con los datos del cliente', 'campos': campos}), 400

        errors = verificar_JSON(data, campos)

        if len(errors) > 0:
            return basicError(errors)
        
        cliente = Cliente(
            id=str(uuid4()),
            nombre=data['nombre'],
            telefono=data['telefono'],
            direccion=data['direccion'],
            fecha_instalacion=data['fecha_instalacion'],
            sede=data['sede'],
            paquete=data['paquete'],
            login=data['login'],
            caja=data['caja'],
            borne=data['borne'],
            status=data['status'],
            monto=data['monto'],
            iptv=data['iptv'],
            user=user.id
        )

        db.session.add(cliente)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Cliente agregado exitosamente'})
    except:
        abort(500)


@jwt_required()
@app.route('/cliente/<id>', methods=['GET'])
def get_cliente(id):
    try:
        user = getUser()

        cliente = Cliente.query.filter_by(id=id).first()

        if cliente is None:
            return jsonify({'success': False, 'message': 'Cliente no encontrado'}), 400
        elif cliente.user != user.id:
            abort(403)
        else:
            return jsonify({'success': True, 'cliente': cliente.serialize()})
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/cliente/<id>', methods=['PUT'])
def update_cliente(id):
    campos = ['nombre', 'telefono', 'direccion', 'fecha_instalacion', 'sede', 'paquete', 'login', 'caja', 'borne', 'status', 'monto', 'iptv']

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con algun dato modificado del cliente', 'campos': campos}), 400

        errors = verificar_JSON(data, campos)

        if len(errors) > (len(campos)-1):
            return jsonify({'success': False, 'errors': ['Se esperaba al menos un campo a modificar'], 'campos': campos}), 400
                                    

        cliente = Cliente.query.filter_by(id=id).first()

        if cliente is None:
            return jsonify({'success': False, 'message': 'Cliente no encontrado'}), 400
        elif cliente.user != user.id:
            abort(403)
        else:
            for campo in campos:
                if campo in data:
                    setattr(cliente, campo, data[campo])
            
            db.session.commit()

            return jsonify({'success': True, 'message': 'Cliente actualizado exitosamente', 'cliente': cliente.serialize()})
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/cliente/<id>', methods=['DELETE'])
def delete_cliente(id):
    try:
        user = getUser()

        cliente = Cliente.query.filter_by(id=id).first()

        if cliente is None:
            return jsonify({'success': False, 'message': 'Cliente no encontrado'}), 400
        elif cliente.user != user.id:
            abort(403)
        else:
            db.session.delete(cliente)
            db.session.commit()

            return jsonify({'success': True, 'message': 'Cliente eliminado exitosamente'})
    except Exception as e:
        print(e)
        abort(500)


# RUTAS DE GESTIÓN DE DEBERES .........................................................................................
@jwt_required()
@app.route('/deber', methods=['GET'])
def get_deber():
    try:
        user = getUser()

        deberes = Deber.query.filter_by(user=user.id).all()

        deberes = [{'id': deber.id, 'detalle': deber.detalle, 'descripcion': deber.descripcion, 'fecha_inicio': deber.fecha_inicio, 'repeticion': deber.repeticion} for deber in deberes]

        return jsonify({'success': True, 'deberes': deberes})
    except:
        abort(500)


@jwt_required()
@app.route('/deber', methods=['POST'])
def add_deber():
    campos = ['detalle', 'descripcion', 'fecha_inicio', 'repeticion']

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con los datos del deber', 'campos': campos}), 400

        errors = verificar_JSON(data, campos)

        if len(errors) > 0:
            return basicError(errors)
        
        deber = Deber(
            id=str(uuid4()),
            detalle=data['detalle'],
            descripcion=data['descripcion'],
            fecha_inicio=data['fecha_inicio'],
            repeticion=data['repeticion'],
            user=user.id
        )

        db.session.add(deber)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Deber agregado exitosamente'})
    except:
        abort(500)


@jwt_required()
@app.route('/deber/<id>', methods=['GET'])
def get_deber_id(id):
    try:
        user = getUser()

        deber = Deber.query.filter_by(id=id).first()

        if deber is None:
            return jsonify({'success': False, 'message': 'Deber no encontrado'}), 400
        elif deber.user != user.id:
            abort(403)
        else:
            return jsonify({'success': True, 'deber': {'id': deber.id, 'detalle': deber.detalle, 'descripcion': deber.descripcion, 'fecha_inicio': deber.fecha_inicio, 'repeticion': deber.repeticion}})
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/deber/<id>', methods=['PUT'])
def update_deber(id):
    campos = ['detalle', 'descripcion', 'fecha_inicio', 'repeticion']

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con algun dato modificado del deber', 'campos': campos}), 400

        errors = verificar_JSON(data, campos)

        if len(errors) > (len(campos)-1):
            return jsonify({'success': False, 'errors': ['Se esperaba al menos un campo a modificar'], 'campos': campos}), 400
                                    

        deber = Deber.query.filter_by(id=id).first()

        if deber is None:
            return jsonify({'success': False, 'message': 'Deber no encontrado'}), 400
        elif deber.user != user.id:
            abort(403)
        else:
            for campo in campos:
                if campo in data:
                    setattr(deber, campo, data[campo])
            
            db.session.commit()

            return jsonify({'success': True, 'message': 'Deber actualizado exitosamente', 'deber': deber.serialize()})
        
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/deber/<id>', methods=['DELETE'])
def delete_deber(id):
    try:
        user = getUser()

        deber = Deber.query.filter_by(id=id).first()

        if deber is None:
            return jsonify({'success': False, 'message': 'Deber no encontrado'}), 400
        elif deber.user != user.id:
            abort(403)
        else:
            db.session.delete(deber)
            db.session.commit()

            return jsonify({'success': True, 'message': 'Deber eliminado exitosamente'})
    except Exception as e:
        print(e)
        abort(500)


# RUTAS DE GESTIÓN DE MOVIMIENTOS .....................................................................................
@jwt_required()
@app.route('/movimiento', methods=['GET'])
def get_movimientos():
    try:
        arguments = request.args
        user = getUser()

        gastos = {
            # esporadicos debe tener como tipo 'gasto'
            'esporadicos': [],
            'fijos': []
        }
        ingresos = {
            'esporadicos': [],
            'fijos': []
        }

        # Obtener el año donde se realizaron los movimientos
        anio = Movimiento.query.filter_by(user=user.id).order_by(Movimiento.fecha.desc()).first().fecha.year

        if 'anio' in arguments:
            anio = arguments['anio']

        # para los esporadicos distribuir entre ganancias y gastos
        esporadicos = Esporadico.query.filter_by(user=user.id).join(Movimiento).filter(Movimiento.fecha.year == anio).all()

        for esporadico in esporadicos:
            if esporadico.tipo == 'ingreso':
                ingresos['esporadicos'].append(esporadico.serialize())
            else:
                gastos['esporadicos'].append(esporadico.serialize())

        # para los fijos solo consultar los gastos y los ingresos
        gastos_fijos = GastoFijo.query.filter_by(user=user.id).join(Fijo).join(Movimiento).filter(Movimiento.fecha.year == anio).all()
        ingresos_fijos = IngresoFijo.query.filter_by(user=user.id).join(Fijo).join(Movimiento).filter(Movimiento.fecha.year == anio).all()

        # serializar los movimientos
        gastos['fijos'] = [gasto.serialize() for gasto in gastos_fijos]
        ingresos['fijos'] = [ingreso.serialize() for ingreso in ingresos_fijos]

        # calculos adicionales

        gastoTotal = sum([gasto['monto'] for gasto in gastos['fijos']])
        ingresoTotal = sum([ingreso['monto'] for ingreso in ingresos['fijos']])

        gastos['total'] = gastoTotal
        ingresos['total'] = ingresoTotal

        ganancia = ingresoTotal - gastoTotal

        # retornar los movimientos
        return jsonify({'success': True, 'gastos': gastos, 'ingresos': ingresos, 'ganancia': ganancia})
    
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/movimiento/esporadico', methods=['POST'])
def add_esporadico():
    campos = ['tipo', 'descripcion', 'detalle_pago', 'fecha', 'monto']

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con los datos del movimiento esporadico', 'campos': campos}), 400

        errors = verificar_JSON(data, campos)

        if len(errors) > 0:
            return basicError(errors)
        
        if data['tipo'] not in ['ingreso', 'gasto']:
            return jsonify({'success': False, 'errors': ['El campo "tipo" debe ser "ingreso" o "gasto"']}), 400
        
        movimiento = Movimiento(
            id=str(uuid4()),
            fecha=data['fecha'],
            monto=data['monto'],
            user=user.id
        )

        esporadico = Esporadico(
            id=movimiento.id,
            tipo=data['tipo'],
            descripcion=data['descripcion'],
            detalle_pago=data['detalle_pago'],
            user=user.id,
            movimiento=movimiento
        )

        db.session.add(movimiento)
        db.session.add(esporadico)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Movimiento esporadico agregado exitosamente'})
    except:
        abort(500)


@jwt_required()
@app.route('/movimiento/fijo/<tipo>', methods=['POST'])
def add_fijo(tipo):
    campos = ['numero_operacion', 'observacion', 'fecha', 'monto']
    
    if tipo not in ['ingreso', 'gasto']:
        return jsonify({'success': False, 'message': 'El tipo de movimiento fijo debe ser "ingreso" o "gasto"'}), 400

    try:
        user = getUser()

        try:
            data = request.get_json()
        except:
            return jsonify({'success': False, 'message': 'Se esperaba un JSON con los datos del movimiento fijo', 'campos': campos}), 400
        
        errors = verificar_JSON(data, campos)

        if len(errors) > 0:
            return basicError(errors)
        
        movimiento = Movimiento(
            id=str(uuid4()),
            fecha=data['fecha'],
            monto=data['monto'],
            user=user.id
        )

        fijo = Fijo(
            id=movimiento.id,
            numero_operacion=data['numero_operacion'],
            observacion=data['observacion'],
            user_id=user.id,
            movimiento=movimiento
        )

        if tipo == 'ingreso':
            errors = verificar_JSON(data, ['cliente_id'])
            if len(errors) > 0:
                return basicError(errors)
            
            cliente = Cliente.query.filter_by(user=user.id, id=data['cliente_id']).first()

            if cliente is None:
                return jsonify({'success': False, 'message': 'El cliente no existe'}), 400

            ingreso = IngresoFijo(
                id=fijo.id,
                cliente_id=data['cliente_id'],
                user=user.id,
                fijo=fijo,
                cliente=cliente
            )
        else:
            errors = verificar_JSON(data, ['deber_id'])
            if len(errors) > 0:
                return basicError(errors)
            
            deber = Deber.query.filter_by(user=user.id, id=data['deber_id']).first()

            if deber is None:
                return jsonify({'success': False, 'message': 'El deber no existe'}), 400

            gasto = GastoFijo(
                id=fijo.id,
                deber_id=data['deber_id'],
                user=user.id,
                fijo=fijo,
                deber=deber
            )

        db.session.add(movimiento)
        db.session.add(fijo)
        if tipo == 'ingreso':
            db.session.add(ingreso)
        else:
            db.session.add(gasto)
        db.session.commit()
    
        return jsonify({'success': True, 'message': 'Movimiento fijo agregado exitosamente', 'movimiento': ingreso.serialize() if tipo == 'ingreso' else gasto.serialize()})
    
    except Exception as e:
        print(e)
        abort(500)


@jwt_required()
@app.route('/movimiento/esporadico/<id>', methods=['GET'])
def get_esporadico(id):
    try:
        user = getUser()

        esporadico = Esporadico.query.filter_by(id=id).first()

        if esporadico is None:
            return jsonify({'success': False, 'message': 'Movimiento esporadico no encontrado'}), 400
        elif esporadico.user != user.id:
            abort(403)
        else:
            return jsonify({'success': True, 'movimiento': esporadico.serialize()})
    except Exception as e:
        print(e)
        abort(500)





# Error handler
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'success': False, 'message': 'Página no encontrada'}), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.errorhandler(400)
def bad_request(e):
    return jsonify({'success': False, 'message': 'Solicitud incorrecta'}), 400

@app.errorhandler(401)
def unauthorized(e):
    return jsonify({'success': False, 'message': 'No autorizado'}), 401

@app.errorhandler(403)
def forbidden(e):
    return jsonify({'success': False, 'message': 'Prohibido'}), 403

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({'success': False, 'message': 'Método no permitido'}), 405