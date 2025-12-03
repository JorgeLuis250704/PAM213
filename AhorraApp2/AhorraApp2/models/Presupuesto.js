export class Presupuesto {
    constructor(id, categoria, monto, fechaCreacion) {
        this.id = id;
        this.categoria = categoria;
        this.monto = monto;
        this.fechaCreacion = fechaCreacion;
    }

    static validar(categoria, monto) {
        if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
            throw new Error("La categoría es obligatoria.");
        }
        if (isNaN(monto) || monto <= 0) {
            throw new Error("El monto debe ser un número positivo.");
        }
    }
}
