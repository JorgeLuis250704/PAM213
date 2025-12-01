import { Platform } from 'react-native';
// Asegúrate de tener instalado 'expo-sqlite'
import * as SQLite from 'expo-sqlite'; 

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKeys = {
            usuarios: 'usuarios',
            registros: 'registros'
        };
    }

    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage (WEB)');
        } else {
            console.log('Usando SQLite (MÓVIL)');
            this.db = SQLite.openDatabase('miapp.db');

            // Crear tabla usuarios (Ya estaba en el código de UsuarioController, pero se repite aquí para asegurar)
            this.db.transaction(tx => {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS usuarios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT NOT NULL,
                        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                `);
            });

            // Crear tabla registros (Ya estaba en el código de RegistroController, pero se repite aquí para asegurar)
            this.db.transaction(tx => {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS registros (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT NOT NULL,
                        monto REAL DEFAULT 0,
                        categoria TEXT DEFAULT '',
                        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                `);
            });
        }
    }

    // --------------------------------------------
    // GET ALL
    // --------------------------------------------
    async getAll(tabla) {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(this.storageKeys[tabla]);
            return data ? JSON.parse(data) : [];
        } else {
            return new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(
                        `SELECT * FROM ${tabla} ORDER BY id DESC`,
                        [],
                        (_, { rows }) => resolve(rows._array),
                        (_, error) => reject(error)
                    );
                });
            });
        }
    }

    // --------------------------------------------
    // ADD
    // --------------------------------------------
    async add(tabla, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            const lista = await this.getAll(tabla);
            const nuevo = {
                id: Date.now(),
                nombre,
                monto,
                categoria,
                fecha_creacion: new Date().toISOString()
            };
            // Se añade al inicio para que aparezca primero en la lista
            lista.unshift(nuevo); 
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(lista));
            return nuevo;
        } else {
            return new Promise((resolve, reject) => {
                const fecha = new Date().toISOString();
                this.db.transaction(tx => {
                    if (tabla === 'usuarios') {
                        tx.executeSql(
                            `INSERT INTO usuarios (nombre, fecha_creacion) VALUES (?, ?)`,
                            [nombre, fecha],
                            (_, result) => resolve({ id: result.insertId, nombre, fecha_creacion: fecha }),
                            (_, error) => reject(error)
                        );
                    } else if (tabla === 'registros') {
                        tx.executeSql(
                            `INSERT INTO registros (nombre, monto, categoria, fecha_creacion) VALUES (?, ?, ?, ?)`,
                            [nombre, monto, categoria, fecha],
                            (_, result) => resolve({ id: result.insertId, nombre, monto, categoria, fecha_creacion: fecha }),
                            (_, error) => reject(error)
                        );
                    }
                });
            });
        }
    }

    // --------------------------------------------
    // UPDATE
    // --------------------------------------------
    async update(tabla, id, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.map(r => r.id === id ? { ...r, nombre, monto, categoria } : r);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(nuevaLista));
            return true;
        } else {
            return new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    if (tabla === 'usuarios') {
                        tx.executeSql(
                            `UPDATE usuarios SET nombre=? WHERE id=?`,
                            [nombre, id],
                            () => resolve(true),
                            (_, error) => reject(error)
                        );
                    } else if (tabla === 'registros') {
                        tx.executeSql(
                            `UPDATE registros SET nombre=?, monto=?, categoria=? WHERE id=?`,
                            [nombre, monto, categoria, id],
                            () => resolve(true),
                            (_, error) => reject(error)
                        );
                    }
                });
            });
        }
    }

    // --------------------------------------------
    // DELETE
    // --------------------------------------------
    async delete(tabla, id) {
        if (Platform.OS === 'web') {
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.filter(r => r.id !== id);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(nuevaLista));
            return true;
        } else {
            return new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(
                        `DELETE FROM ${tabla} WHERE id=?`,
                        [id],
                        () => resolve(true),
                        (_, error) => reject(error)
                    );
                });
            });
        }
    }

    // --------------------------------------------
    // DELETE ALL
    // --------------------------------------------
    async deleteAll(tabla) {
        if (Platform.OS === 'web') {
            localStorage.removeItem(this.storageKeys[tabla]);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(
                        `DELETE FROM ${tabla}`,
                        [],
                        () => resolve(true),
                        (_, error) => reject(error)
                    );
                });
            });
        }
    }
}

export default new DatabaseService();