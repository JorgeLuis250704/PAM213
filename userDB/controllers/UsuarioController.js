import { Usuario } from '../models/usuario';
import DatabaseService from '../database/DatabaseService';

export class UsuarioController {
    constructor() {
        // Arreglo para almacenar los callbacks de los componentes suscritos
        this.listeners = [];
    }

    /**
     * Inicializa la base de datos (llamado una vez al inicio)
     */
    async initialize() {
        await DatabaseService.initialize();
    }

    // --- Métodos de Lógica de Negocio ---

    /**
     * Obtiene todos los usuarios desde el servicio de datos y los mapea al modelo Usuario.
     * @returns {Promise<Usuario[]>} Lista de instancias del modelo Usuario.
     */
    async obtenerUsuarios() {
        try {
            const data = await DatabaseService.getAll();
            // Mapea los resultados del servicio a instancias del modelo Usuario
            return data.map(u => new Usuario(u.id, u.nombre, u.fecha_creacion));
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw new Error('No se pudieron cargar los usuarios');
        }
    }

    /**
     * Crea un nuevo usuario: valida, inserta y notifica.
     * @param {string} nombre - El nombre del usuario a crear.
     * @returns {Promise<Usuario>} La instancia del modelo Usuario creado.
     */
    async crearUsuario(nombre) {
        try {
            // 1. Validar datos usando el modelo
            Usuario.validar(nombre); 

            // 2. Insertar en BD
            const nuevoUsuario = await DatabaseService.add(nombre.trim());

            // 3. Notificar a la vista que hay un cambio (Patrón Observer) 
            this.notifyListeners(); 

            // 4. Retornar el usuario creado
            return new Usuario(
                nuevoUsuario.id, 
                nuevoUsuario.nombre, 
                nuevoUsuario.fecha_creacion
            );
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // --- Patrón Observer (Suscripción y Notificación) ---

    /**
     * Agrega una función de callback a la lista de observadores.
     * @param {function} callback - Función a ejecutar cuando ocurra un cambio.
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remueve una función de callback de la lista de observadores.
     * Esencial para prevenir memory leaks en componentes React/React Native.
     * @param {function} callback - Función que se desea remover.
     */
    removeListener(callback) {
        // Filtra para remover el listener específico
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    /**
     * Ejecuta todas las funciones de callback suscritas.
     * Esto le dice a la(s) vista(s) que deben recargar la información.
     */
    notifyListeners() {
        // Ejecuta todas las funciones de los componentes suscritos
        this.listeners.forEach(callback => callback());
    }
}