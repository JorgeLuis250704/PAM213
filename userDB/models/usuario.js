// models/Usuario.js

export class Usuario {

    /**
     * Modelo Usuario en arquitectura MVC.
     * @param {number} id
     * @param {string} nombre
     * @param {string} fechaCreacion
     */
    constructor(id, nombre, fechaCreacion) {
        this.id = id;
        this.nombre = nombre?.trim(); 
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    // ------------------------------------------------------------------
    // ---------------- REGLAS DE NEGOCIO / VALIDACIONES ----------------
    // ------------------------------------------------------------------

    /**
     * Valida que el nombre cumpla con las reglas de negocio.
     * @param {string} nombre
     */
    static validar(nombre) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        if (nombre.trim().length > 50) {
            throw new Error("El nombre no puede tener más de 50 caracteres");
        }
        return true;
    }

    // ------------------------------------------------------------------
    // -------------------- MÉTODOS AUXILIARES --------------------------
    // ------------------------------------------------------------------

    /**
     * Crea un objeto Usuario a partir de una fila de SQLite.
     */
    static fromDatabase(row) {
        return new Usuario(
            row.id,
            row.nombre,
            row.fecha_creacion
        );
    }

    /**
     * Serializa el usuario a un objeto JSON.
     * Sirve para localStorage, APIs, etc.
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            fechaCreacion: this.fechaCreacion
        };
    }
}
