// database/DatabaseService.js
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKey = 'usuarios';
    }

    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage (WEB)');
        } else {
            console.log('Usando SQLite (MÓVIL)');
            this.db = await SQLite.openDatabaseAsync('miapp.db');

            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    // --------------------------------------------
    // SELECT
    // --------------------------------------------
    async getAll() {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } else {
            return await this.db.getAllAsync(
                'SELECT * FROM usuarios ORDER BY id DESC'
            );
        }
    }

    // --------------------------------------------
    // INSERT
    // --------------------------------------------
    async add(nombre) {
        if (Platform.OS === 'web') {
            const lista = await this.getAll();
            const nuevo = {
                id: Date.now(),
                nombre,
                fecha_creacion: new Date().toISOString()
            };
            lista.unshift(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(lista));
            return nuevo;
        } else {
            const fecha = new Date().toISOString();
            const result = await this.db.runAsync(
                'INSERT INTO usuarios (nombre, fecha_creacion) VALUES (?, ?)',
                [nombre, fecha]
            );
            return {
                id: result.lastInsertRowId,
                nombre,
                fecha_creacion: fecha
            };
        }
    }

    // --------------------------------------------
    // UPDATE
    // --------------------------------------------
    async update(id, nuevoNombre) {
        if (Platform.OS === 'web') {
            const lista = await this.getAll();
            const nuevaLista = lista.map(u =>
                u.id === id
                    ? { ...u, nombre: nuevoNombre }
                    : u
            );
            localStorage.setItem(this.storageKey, JSON.stringify(nuevaLista));
            return true;
        } else {
            await this.db.runAsync(
                'UPDATE usuarios SET nombre = ? WHERE id = ?',
                [nuevoNombre, id]
            );
            return true;
        }
    }

    // --------------------------------------------
    // DELETE (1 usuario)
    // --------------------------------------------
    async delete(id) {
        if (Platform.OS === 'web') {
            const lista = await this.getAll();
            const nuevaLista = lista.filter(u => u.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(nuevaLista));
            return true;
        } else {
            await this.db.runAsync(
                'DELETE FROM usuarios WHERE id = ?',
                [id]
            );
            return true;
        }
    }

    // --------------------------------------------
    // DELETE ALL
    // --------------------------------------------
    async deleteAll() {
        if (Platform.OS === 'web') {
            localStorage.removeItem(this.storageKey);
            return true;
        } else {
            await this.db.runAsync('DELETE FROM usuarios');
            return true;
        }
    }
}

export default new DatabaseService();
