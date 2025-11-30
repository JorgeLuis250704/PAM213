// database/DatabaseService.js
import { Platform } from 'react-native';
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
        }
    }

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

    async add(tabla, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            const lista = await this.getAll(tabla);
            const nuevo = { id: Date.now(), nombre, monto, categoria, fecha_creacion: new Date().toISOString() };
            lista.unshift(nuevo);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(lista));
            return nuevo;
        } else {
            return new Promise((resolve, reject) => {
                const fecha = new Date().toISOString();
                this.db.transaction(tx => {
                    tx.executeSql(
                        `INSERT INTO ${tabla} (nombre, monto, categoria, fecha_creacion) VALUES (?, ?, ?, ?)`,
                        [nombre, monto, categoria, fecha],
                        (_, result) => resolve({ id: result.insertId, nombre, monto, categoria, fecha_creacion: fecha }),
                        (_, error) => reject(error)
                    );
                });
            });
        }
    }

    async update(tabla, id, nombre, monto = 0, categoria = '') {
        if (Platform.OS === 'web') {
            const lista = await this.getAll(tabla);
            const nuevaLista = lista.map(r => r.id === id ? { ...r, nombre, monto, categoria } : r);
            localStorage.setItem(this.storageKeys[tabla], JSON.stringify(nuevaLista));
            return true;
        } else {
            return new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(
                        `UPDATE ${tabla} SET nombre=?, monto=?, categoria=? WHERE id=?`,
                        [nombre, monto, categoria, id],
                        () => resolve(true),
                        (_, error) => reject(error)
                    );
                });
            });
        }
    }

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
}

export default new DatabaseService();
