// models/Registro.js
export class Registro {
    /**
     * Modelo Registro en arquitectura MVC.
     * @param {number} id
     * @param {string} nombre
     * @param {number} monto
     * @param {string} categoria
     * @param {string} fechaCreacion
     */
    constructor(id, nombre, monto = 0, categoria = '', fechaCreacion) {
        this.id = id;
        this.nombre = nombre?.trim();
        this.monto = Number(monto) || 0;
        this.categoria = categoria?.trim() || '';
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    // Validaciones
    static validar(nombre, monto = 0, categoria = '') {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        if (nombre.trim().length > 50) {
            throw new Error("El nombre no puede tener más de 50 caracteres");
        }
        if (isNaN(monto) || monto < 0) {
            throw new Error("El monto debe ser un número positivo");
        }
        if (categoria.length > 50) {
            throw new Error("La categoría no puede tener más de 50 caracteres");
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            monto: this.monto,
            categoria: this.categoria,
            fechaCreacion: this.fechaCreacion
        };
    }
}
