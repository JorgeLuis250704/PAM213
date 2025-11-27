import { Platform } from 'react-native';
// Asegúrate de tener instalado expo-sqlite: expo install expo-sqlite
import * as SQLite from 'expo-sqlite'; 

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKey = 'usuarios';
    }

    /**
     * Inicializa la conexión a la base de datos (SQLite) o confirma el uso de LocalStorage (Web).
     */
    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage para web');
        } else {
            console.log('Usando SQLite para móvil');
            // Abre la base de datos SQLite
            this.db = await SQLite.openDatabaseAsync('miapp.db');

            // Crea la tabla si no existe
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    /**
     * Obtiene todos los usuarios persistidos.
     * @returns {Promise<Array>} Lista de objetos de usuario.
     */
    async getAll() {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } else {
            // Usa el método para obtener todos los resultados de una consulta
            return await this.db.getAllAsync('SELECT * FROM usuarios ORDER BY id DESC');
        }
    }

    /**
     * Agrega un nuevo usuario a la persistencia.
     * @param {string} nombre - El nombre del nuevo usuario.
     * @returns {Promise<Object>} El objeto del usuario creado con su ID.
     */
    async add(nombre) {
        if (Platform.OS === 'web') {
            const usuarios = await this.getAll();
            const nuevoUsuario = {
                id: Date.now(), // Usamos timestamp como ID simulado
                nombre,
                fecha_creacion: new Date().toISOString()
            };
            usuarios.unshift(nuevoUsuario); // Agregar al inicio
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return nuevoUsuario;
        } else {
            // Ejecuta la consulta de inserción con parámetros seguros
            const result = await this.db.runAsync(
                'INSERT INTO usuarios(nombre, fecha_creacion) VALUES(?, ?)',
                [nombre, new Date().toISOString()]
            );
            // Retorna el objeto del nuevo usuario con el ID generado por SQLite
            return {
                id: result.lastInsertRowId,
                nombre,
                fecha_creacion: new Date().toISOString()
            };
        }
    }
}

// Exportar una única instancia de la clase (Singleton)
export default new DatabaseService();