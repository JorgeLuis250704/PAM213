// controllers/RegistroController.js
import { Registro } from '../models/Registro';
import DatabaseService from '../database/DatabaseService';

export class RegistroController {
    constructor() {
        this.listeners = [];
    }

    async initialize() {
        try {
            await DatabaseService.initialize();
            // Aseguramos la tabla de registros
            if (DatabaseService.db) {
                DatabaseService.db.transaction(tx => {
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
        } catch (error) {
            console.error("Error al inicializar BD:", error);
            throw new Error("No se pudo inicializar la base de datos.");
        }
    }

    // ---------------- CRUD ----------------

    async obtenerRegistros() {
        try {
            const data = await DatabaseService.getAll('registros');
            return data.map(r => new Registro(r.id, r.nombre, r.monto, r.categoria, r.fecha_creacion));
        } catch (error) {
            console.error("Error al obtener registros:", error);
            throw new Error("No se pudieron cargar los registros");
        }
    }

    async crearRegistro(nombre, monto = 0, categoria = '') {
        try {
            Registro.validar(nombre, monto, categoria);

            const nuevo = await DatabaseService.add('registros', nombre.trim(), monto, categoria.trim());
            this.notifyListeners();

            return new Registro(nuevo.id, nuevo.nombre, nuevo.monto, nuevo.categoria, nuevo.fecha_creacion);
        } catch (error) {
            console.error("Error al crear registro:", error);
            throw error;
        }
    }

    async actualizarRegistro(id, nombre, monto = 0, categoria = '') {
        try {
            Registro.validar(nombre, monto, categoria);
            await DatabaseService.update('registros', id, nombre.trim(), monto, categoria.trim());
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error("Error al actualizar registro:", error);
            throw new Error("No se pudo actualizar el registro.");
        }
    }

    async eliminarRegistro(id) {
        try {
            await DatabaseService.delete('registros', id);
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error("Error al eliminar registro:", error);
            throw new Error("No se pudo eliminar el registro.");
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb());
    }
}
