import { Platform } from 'react-native';
// Asegúrate de tener instalado 'expo-sqlite' (versión compatible con API asíncrona)
import * as SQLite from 'expo-sqlite'; 

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKeys = {
            usuarios: 'usuarios',
            registros: 'registros'
        };
    }

    /**
     * Inicializa la conexión a la base de datos y crea las tablas si no existen.
     */
    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage (WEB)');
        } else {
            console.log('Usando SQLite (MÓVIL - API Asíncrona)');
            // Usa openDatabaseAsync para la conexión moderna
            this.db = await SQLite.openDatabaseAsync('miapp.db');

            // Ejecuta las creaciones de tablas con execAsync (más limpio)
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS registros (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    monto REAL DEFAULT 0,
                    categoria TEXT DEFAULT '',
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    // --------------------------------------------
    // GET ALL (SELECT)
    // --------------------------------------------
    /**
     * Obtiene todos los registros de la tabla especificada.
     */
    async getAll(tabla) {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(this.storageKeys[tabla]);
            return data ? JSON.parse(data) : [];
        } else {
            // Usa getAllAsync para obtener todos los resultados de una SELECT
            return await this.db.getAllAsync(
                `SELECT * FROM ${tabla} ORDER BY id DESC`
            );
        }
    }

    // --------------------------------------------
    // ADD (INSERT)
    // --------------------------------------------
    /**
     * Inserta un nuevo registro en la tabla especificada.
     */
    async add(tabla, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            const lista = await this.getAll(tabla);
            const nuevo = {
                id: Date.now(), // Simulación de ID
                nombre,
                monto,
                categoria,
                fecha_creacion: new Date().toISOString()
            };
            lista.unshift(nuevo);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(lista));
            return nuevo;
        } else {
            // Lógica para Móvil (SQLite - API Asíncrona)
            const fecha = new Date().toISOString();
            let sql, params;

            if (tabla === 'usuarios') {
                sql = `INSERT INTO usuarios (nombre, fecha_creacion) VALUES (?, ?)`;
                params = [nombre, fecha];
            } else if (tabla === 'registros') {
                sql = `INSERT INTO registros (nombre, monto, categoria, fecha_creacion) VALUES (?, ?, ?, ?)`;
                params = [nombre, monto, categoria, fecha];
            } else {
                throw new Error(`Tabla desconocida al insertar: ${tabla}`);
            }

            // Usa runAsync para operaciones INSERT
            const result = await this.db.runAsync(sql, params);
            
            // Retorna el objeto insertado con su nuevo ID
            const nuevoRegistro = { 
                id: result.lastInsertRowId, 
                nombre, 
                fecha_creacion: fecha,
                ...(tabla === 'registros' && { monto, categoria }) 
            };
            return nuevoRegistro;
        }
    }

    // --------------------------------------------
    // UPDATE
    // --------------------------------------------
    /**
     * Actualiza un registro por su ID en la tabla especificada.
     */
    async update(tabla, id, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.map(r => r.id === id ? { ...r, nombre, monto, categoria } : r);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(nuevaLista));
            return true;
        } else {
            // Lógica para Móvil (SQLite - API Asíncrona)
            let sql, params;

            if (tabla === 'usuarios') {
                sql = `UPDATE usuarios SET nombre=? WHERE id=?`;
                params = [nombre, id];
            } else if (tabla === 'registros') {
                sql = `UPDATE registros SET nombre=?, monto=?, categoria=? WHERE id=?`;
                params = [nombre, monto, categoria, id];
            } else {
                throw new Error(`Tabla desconocida al actualizar: ${tabla}`);
            }
            
            // Usa runAsync para operaciones UPDATE
            await this.db.runAsync(sql, params);
            return true;
        }
    }

    // --------------------------------------------
    // DELETE (1 registro)
    // --------------------------------------------
    /**
     * Elimina un registro por su ID de la tabla especificada.
     */
    async delete(tabla, id) {
        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.filter(r => r.id !== id);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(nuevaLista));
            return true;
        } else {
            // Lógica para Móvil (SQLite - API Asíncrona)
            // Usa runAsync para operaciones DELETE
            await this.db.runAsync(
                `DELETE FROM ${tabla} WHERE id=?`,
                [id]
            );
            return true;
        }
    }

    // --------------------------------------------
    // DELETE ALL
    // --------------------------------------------
    /**
     * Elimina todos los registros de la tabla especificada.
     */
    async deleteAll(tabla) {
        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            localStorage.removeItem(this.storageKeys[tabla]);
            return true;
        } else {
            // Lógica para Móvil (SQLite - API Asíncrona)
            // Usa runAsync para operaciones DELETE ALL
            await this.db.runAsync(`DELETE FROM ${tabla}`);
            return true;
        }
    }
}

// Exportar una única instancia del servicio
export default new DatabaseService();