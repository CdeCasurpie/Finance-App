from flask import Flask, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from uuid import uuid4

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = 'esternocleidomastoideo'

jwt = JWTManager(app)

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
    fecha_instalacion = db.Column(db.String(50), nullable=False)
    sede = db.Column(db.String(50), nullable=False)
    paquete = db.Column(db.String(50), nullable=False)
    login = db.Column(db.String(50), nullable=False, unique=True)
    caja = db.Column(db.Integer, nullable=False)
    borne = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    monto = db.Column(db.Float, nullable=False)
    iptv = db.Column(db.Integer, nullable=False)

class Deber(db.Model):
    __name__ = 'deber'

    id = db.Column(db.String(50), primary_key=True)
    detalle = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200), nullable=False)
    fecha_inicio = db.Column(db.String(50), nullable=False)
    repeticion = db.Column(db.String(50), nullable=False)

class Movimiento(db.Model): #clase padre -> ingresos o gastos
    __name__ = 'movimiento'

    id = db.Column(db.String(50), primary_key=True)
    fecha = db.Column(db.String(50), nullable=False)
    monto = db.Column(db.Float, nullable=False)

class Fijo(Movimiento):
    __name__ = 'fijo'

    id = db.Column(db.String(50), db.ForeignKey('movimiento.id'), primary_key=True)
    numero_operacion = db.Column(db.String(50), nullable=False)
    observacion = db.Column(db.String(100), nullable=False)

class Esporadico(Movimiento):
    __name__ = 'esporadico'

    id = db.Column(db.String(50), db.ForeignKey('movimiento.id'), primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.String(100), nullable=False)
    detalle_pago = db.Column(db.String(100), nullable=False)

class IngresoFijo(Fijo):
    __name__ = 'ingreso_fijo'

    id = db.Column(db.String(50), db.ForeignKey('fijo.id'), primary_key=True)
    cliente = db.Column(db.String(50), db.ForeignKey('cliente.id'), nullable=False)

class GastoFijo(Fijo):
    __name__ = 'gasto_fijo'

    id = db.Column(db.String(50), db.ForeignKey('fijo.id'), primary_key=True)
    deber = db.Column(db.String(50), db.ForeignKey('deber.id'), nullable=False)

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


# RUTAS =================================================================================================================
@app.route('/')
def index():
    return jsonify({'success': True, 'message': 'Bienvenido a la API de gestión de ingresos y gastos. Para la documentación de la API, visite la URL /docs'}), 200


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
                return jsonify({'success': False, 'message': 'El email ya está registrado'}), 400
            
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


def basicError(errors):
    return jsonify({'success': False, 'errors': errors}), 400

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