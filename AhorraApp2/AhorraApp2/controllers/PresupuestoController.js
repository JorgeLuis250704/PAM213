import { Presupuesto } from '../models/Presupuesto';
import DatabaseService from '../database/DatabaseService';

export class PresupuestoController {
    constructor() {
        this.listeners = [];
    }

    async initialize() {
        try {
            await DatabaseService.initialize();
        } catch (error) {
            console.error("Error al inicializar BD:", error);
            throw new Error("No se pudo inicializar la base de datos.");
        }
    }

    // ---------------- CRUD ----------------

    async obtenerPresupuestos() {
        try {
            const data = await DatabaseService.getAll('presupuestos');
            return data.map(p => new Presupuesto(p.id, p.categoria, p.monto, p.fecha_creacion));
        } catch (error) {
            console.error("Error al obtener presupuestos:", error);
            throw new Error("No se pudieron cargar los presupuestos");
        }
    }

    async crearPresupuesto(categoria, monto) {
        try {
            Presupuesto.validar(categoria, Number(monto));

            // Verificar si ya existe un presupuesto para esa categoría (opcional, pero recomendado)
            const existentes = await this.obtenerPresupuestos();
            const duplicado = existentes.find(p => p.categoria === categoria);
            if (duplicado) {
                throw new Error(`Ya existe un presupuesto para ${categoria}. Edítalo en su lugar.`);
            }

            const nuevo = await DatabaseService.add('presupuestos', { categoria: categoria.trim(), monto: Number(monto) });
            this.notifyListeners();

            return new Presupuesto(nuevo.id, nuevo.categoria, nuevo.monto, nuevo.fecha_creacion);
        } catch (error) {
            console.error("Error al crear presupuesto:", error);
            throw error;
        }
    }

    async actualizarPresupuesto(id, categoria, monto) {
        try {
            Presupuesto.validar(categoria, Number(monto));
            await DatabaseService.update('presupuestos', id, { categoria: categoria.trim(), monto: Number(monto) });
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error("Error al actualizar presupuesto:", error);
            throw new Error("No se pudo actualizar el presupuesto.");
        }
    }

    async eliminarPresupuesto(id) {
        try {
            await DatabaseService.delete('presupuestos', id);
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error("Error al eliminar presupuesto:", error);
            throw new Error("No se pudo eliminar el presupuesto.");
        }
    }

    // ---------------- LISTENERS ----------------
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
