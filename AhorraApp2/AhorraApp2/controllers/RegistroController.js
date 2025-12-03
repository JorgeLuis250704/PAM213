import { Registro } from '../models/Registro';
import DatabaseService from '../database/DatabaseService';
import { Alert } from 'react-native';

export class RegistroController {
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

    async obtenerRegistros() {
        try {
            const data = await DatabaseService.getAll('registros');
            return data.map(r => new Registro(r.id, r.nombre, r.monto, r.categoria, r.fecha_creacion, r.tipo));
        } catch (error) {
            console.error("Error al obtener registros:", error);
            throw new Error("No se pudieron cargar los registros");
        }
    }

    async crearRegistro(nombre, monto = 0, categoria = '', tipo = 'gasto') {
        try {
            Registro.validar(nombre, monto, categoria);

            const nuevo = await DatabaseService.add('registros', { nombre: nombre.trim(), monto, categoria: categoria.trim(), tipo });
            this.notifyListeners();

            // 🔔 VERIFICAR PRESUPUESTO (Solo si es gasto)
            if (tipo === 'gasto') {
                await this.verificarPresupuesto(categoria.trim());
            }

            return new Registro(nuevo.id, nuevo.nombre, nuevo.monto, nuevo.categoria, nuevo.fecha_creacion, nuevo.tipo);
        } catch (error) {
            console.error("Error al crear registro:", error);
            throw error;
        }
    }

    async actualizarRegistro(id, nombre, monto = 0, categoria = '', tipo = 'gasto') {
        try {
            Registro.validar(nombre, monto, categoria);
            await DatabaseService.update('registros', id, { nombre: nombre.trim(), monto, categoria: categoria.trim(), tipo });
            this.notifyListeners();

            // 🔔 VERIFICAR PRESUPUESTO TAMBIÉN AL EDITAR
            if (tipo === 'gasto') {
                await this.verificarPresupuesto(categoria.trim());
            }

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

    // ---------------- NOTIFICACIÓN PRESUPUESTO ----------------
    async verificarPresupuesto(categoria) {
        try {
            // 1. Obtener presupuesto de la categoría
            const presupuestos = await DatabaseService.getAll('presupuestos');
            const presupuesto = presupuestos.find(p => p.categoria === categoria);

            if (!presupuesto) return; // No hay límite definido

            // 2. Calcular gasto total del mes actual en esa categoría
            const registros = await DatabaseService.getAll('registros');
            const now = new Date();
            const gastoTotal = registros
                .filter(r =>
                    r.categoria === categoria &&
                    r.tipo === 'gasto' &&
                    new Date(r.fecha_creacion).getMonth() === now.getMonth() &&
                    new Date(r.fecha_creacion).getFullYear() === now.getFullYear()
                )
                .reduce((sum, r) => sum + r.monto, 0);

            // 3. Comparar y Notificar
            if (gastoTotal > presupuesto.monto) {
                Alert.alert(
                    "⚠️ Presupuesto Excedido",
                    `Has gastado $${gastoTotal} en ${categoria}, superando tu presupuesto de $${presupuesto.monto}.`
                );
            } else if (gastoTotal > presupuesto.monto * 0.9) {
                Alert.alert(
                    "⚠️ Alerta de Presupuesto",
                    `Estás cerca del límite en ${categoria}. Llevas $${gastoTotal} de $${presupuesto.monto}.`
                );
            }

        } catch (error) {
            console.error("Error al verificar presupuesto:", error);
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