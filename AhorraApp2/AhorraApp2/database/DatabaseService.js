import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKeys = {
            usuarios: 'usuarios',
            registros: 'registros',
            presupuestos: 'presupuestos'
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

            // ⭐ 1. ABRIR CONEXIÓN ASÍNCRONA
            if (!this.db) {
                this.db = await SQLite.openDatabaseAsync('miapp.db');
            }

            // ⭐ 2. CREAR TABLAS CON execAsync (atomicidad garantizada por diseño)
            await this.db.execAsync(`
                PRAGMA journal_mode = WAL;
                
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    email TEXT UNIQUE,
                    phone TEXT,
                    password TEXT,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS registros (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    monto REAL DEFAULT 0,
                    categoria TEXT DEFAULT '',
                    tipo TEXT DEFAULT 'gasto', -- 'ingreso' o 'gasto'
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    categoria TEXT NOT NULL,
                    monto REAL DEFAULT 0,
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
            const data = localStorage.getItem(this.storageKeys[tabla] || tabla);
            return data ? JSON.parse(data) : [];
        } else {
            if (!this.db) await this.initialize();
            // Usa getAllAsync para obtener todos los resultados de una SELECT
            return await this.db.getAllAsync(
                `SELECT * FROM ${tabla} ORDER BY id DESC`
            );
        }
    }

    // --------------------------------------------
    // GET USER BY EMAIL
    // --------------------------------------------
    async getUserByEmail(email) {
        if (Platform.OS === 'web') {
            const users = await this.getAll('usuarios');
            return users.find(u => u.email === email);
        } else {
            if (!this.db) await this.initialize();
            const result = await this.db.getAllAsync(
                `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
                [email]
            );
            return result.length > 0 ? result[0] : null;
        }
    }

    // --------------------------------------------
    // ADD (INSERT)
    // --------------------------------------------
    /**
     * Inserta un nuevo registro en la tabla especificada.
     */
    async add(tabla, data) {
        // data es un objeto con los campos a insertar
        // Ejemplo usuarios: { nombre, email, phone, password }
        // Ejemplo registros: { nombre, monto, categoria, tipo }
        // Ejemplo presupuestos: { categoria, monto }

        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            const lista = await this.getAll(tabla);
            const nuevo = {
                id: Date.now(), // Simulación de ID
                ...data,
                fecha_creacion: new Date().toISOString()
            };
            lista.unshift(nuevo);
            localStorage.setItem(this.storageKeys[tabla] || tabla, JSON.stringify(lista));
            return nuevo;
        } else {
            if (!this.db) await this.initialize();
            // Lógica para Móvil (SQLite - API Asíncrona)
            const fecha = new Date().toISOString();
            let sql, params;

            if (tabla === 'usuarios') {
                sql = `INSERT INTO usuarios (nombre, email, phone, password, fecha_creacion) VALUES (?, ?, ?, ?, ?)`;
                params = [data.nombre, data.email, data.phone, data.password, fecha];
            } else if (tabla === 'registros') {
                // Asegurar valores por defecto
                const monto = data.monto || 0;
                const categoria = data.categoria || '';
                const tipo = data.tipo || 'gasto';

                sql = `INSERT INTO registros (nombre, monto, categoria, tipo, fecha_creacion) VALUES (?, ?, ?, ?, ?)`;
                params = [data.nombre, monto, categoria, tipo, fecha];
            } else if (tabla === 'presupuestos') {
                const monto = data.monto || 0;
                const categoria = data.categoria || '';

                sql = `INSERT INTO presupuestos (categoria, monto, fecha_creacion) VALUES (?, ?, ?)`;
                params = [categoria, monto, fecha];
            } else {
                throw new Error(`Tabla desconocida al insertar: ${tabla}`);
            }

            // Usa runAsync para operaciones INSERT
            try {
                const result = await this.db.runAsync(sql, params);

                // Retorna el objeto insertado con su nuevo ID
                return {
                    id: result.lastInsertRowId,
                    ...data,
                    fecha_creacion: fecha
                };
            } catch (error) {
                console.error("Error al insertar en DB:", error);
                return null;
            }
        }
    }

    // --------------------------------------------
    // UPDATE
    // --------------------------------------------
    /**
     * Actualiza un registro por su ID en la tabla especificada.
     */
    async update(tabla, id, data) {
        if (Platform.OS === 'web') {
            // Lógica para Web (LocalStorage)
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.map(r => r.id === id ? { ...r, ...data } : r);
            localStorage.setItem(this.storageKeys[tabla] || tabla, JSON.stringify(nuevaLista));
            return true;
        } else {
            if (!this.db) await this.initialize();
            // Lógica para Móvil (SQLite - API Asíncrona)
            let sql, params;

            if (tabla === 'usuarios') {
                sql = `UPDATE usuarios SET nombre=?, email=?, phone=?, password=? WHERE id=?`;
                params = [data.nombre, data.email, data.phone, data.password, id];
            } else if (tabla === 'registros') {
                sql = `UPDATE registros SET nombre=?, monto=?, categoria=?, tipo=? WHERE id=?`;
                params = [data.nombre, data.monto, data.categoria, data.tipo, id];
            } else if (tabla === 'presupuestos') {
                sql = `UPDATE presupuestos SET categoria=?, monto=? WHERE id=?`;
                params = [data.categoria, data.monto, id];
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
            localStorage.setItem(this.storageKeys[tabla] || tabla, JSON.stringify(nuevaLista));
            return true;
        } else {
            if (!this.db) await this.initialize();
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
            localStorage.removeItem(this.storageKeys[tabla] || tabla);
            return true;
        } else {
            if (!this.db) await this.initialize();
            // Lógica para Móvil (SQLite - API Asíncrona)
            // Usa runAsync para operaciones DELETE ALL
            await this.db.runAsync(`DELETE FROM ${tabla}`);

            // Si es registros, recrear tabla por si acaso (aunque DELETE FROM no borra tabla)
            // Pero para consistencia con el código anterior:
            if (tabla === 'registros' || tabla === 'presupuestos') {
                // No es necesario recrear la tabla si solo borramos datos.
            }
            return true;
        }
    }

    // --------------------------------------------
    // UPDATE USER PASSWORD
    // --------------------------------------------
    async updateUserPassword(email, newPassword) {
        if (Platform.OS === 'web') {
            const users = await this.getAll('usuarios');
            const userIndex = users.findIndex(u => u.email === email);
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('usuarios', JSON.stringify(users));
                return true;
            }
            return false;
        } else {
            if (!this.db) await this.initialize();
            const result = await this.db.runAsync(
                `UPDATE usuarios SET password = ? WHERE email = ?`,
                [newPassword, email]
            );
            return result.changes > 0;
        }
    }
}

// Exportar una única instancia del servicio
export default new DatabaseService();