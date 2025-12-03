// controllers/UsuarioController.js (SIN CAMBIOS, YA ESTABA CORRECTO)

import { Usuario } from '../models/usuario';
import DatabaseService from '../database/DatabaseService';

export class UsuarioController {

    constructor() {
        this.listeners = [];
    }

    /**
     * Inicializa la base de datos (llamado una vez al inicio)
     */
    async initialize() {
        try {
            // CORRECTO: Solo llama y espera a la inicialización del servicio.
            await DatabaseService.initialize();
        } catch (error) {
            console.error("Error al inicializar la BD:", error);
            throw new Error("No se pudo inicializar la base de datos.");
        }
    }

    // --------------------------------------------------------------------
    // MÉTODOS PRINCIPALES DE NEGOCIO (CRUD)
    // --------------------------------------------------------------------

    /**
     * Obtiene todos los usuarios desde el servicio de datos.
     * @returns {Promise<Usuario[]>}
     */
    async obtenerUsuarios() {
        try {
            // Se asume que DatabaseService.getAll() usará 'usuarios' por defecto o debe recibir 'usuarios' como argumento
            const data = await DatabaseService.getAll('usuarios'); 
            return data.map(u => new Usuario(u.id, u.nombre, u.fecha_creacion));
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw new Error("No se pudieron cargar los usuarios");
        }
    }

    /**
     * Crea e inserta un usuario.
     * @param {string} nombre
     * @returns {Promise<Usuario>}
     */
    async crearUsuario(nombre) {
        try {
            Usuario.validar(nombre); // Validación desde el modelo

            // Se asume que DatabaseService.add() usará 'usuarios' por defecto o debe recibir 'usuarios' como argumento
            const nuevoUsuario = await DatabaseService.add('usuarios', nombre.trim()); 

            this.notifyListeners();

            return new Usuario(
                nuevoUsuario.id,
                nuevoUsuario.nombre,
                nuevoUsuario.fecha_creacion
            );

        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    }

    /**
     * Actualiza un usuario por ID
     */
    async actualizarUsuario(id, nuevoNombre) {
        try {
            Usuario.validar(nuevoNombre);

            // Se asume que DatabaseService.update() usará 'usuarios' por defecto o debe recibir 'usuarios' como argumento
            await DatabaseService.update('usuarios', id, nuevoNombre.trim());
            this.notifyListeners();
            return true;

        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw new Error("No se pudo actualizar el usuario.");
        }
    }

    /**
     * Elimina un usuario por ID
     */
    async eliminarUsuario(id) {
        try {
            // Se asume que DatabaseService.delete() usará 'usuarios' por defecto o debe recibir 'usuarios' como argumento
            await DatabaseService.delete('usuarios', id);
            this.notifyListeners();
            return true;

        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            throw new Error("No se pudo eliminar el usuario.");
        }
    }

    /**
     * Elimina TODOS los usuarios
     */
    async eliminarTodos() {
        try {
            // Se asume que DatabaseService.deleteAll() usará 'usuarios' por defecto o debe recibir 'usuarios' como argumento
            await DatabaseService.deleteAll('usuarios');
            this.notifyListeners();
            return true;

        } catch (error) {
            console.error("Error al eliminar todos los usuarios:", error);
            throw new Error("No se pudieron eliminar los usuarios.");
        }
    }

    // --------------------------------------------------------------------
    // PATRÓN OBSERVER
    // --------------------------------------------------------------------

    /**
     * Suscribe un callback para notificar cambios
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Cancela la suscripción de un callback
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(
            listener => listener !== callback
        );
    }

    /**
     * Notifica a todos los suscriptores
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}