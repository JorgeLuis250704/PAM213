export class Usuario {
    /**
     * Define la estructura y el estado de la entidad Usuario.
     * @param {number} id - Identificador único.
     * @param {string} nombre - Nombre del usuario.
     * @param {string} fechaCreacion - Fecha de creación en formato ISO string.
     */
    constructor(id, nombre, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        // Si no se proporciona fecha, usa la fecha y hora actual en formato ISO
        this.fechaCreacion = fechaCreacion || new Date().toISOString(); 
    }

    // --- Validaciones de Reglas de Negocio (Estáticas) ---
    /**
     * Valida que el nombre cumpla con las reglas de negocio.
     * Lanza un error si la validación falla.
     * Este método se llama desde el UsuarioController antes de intentar guardar en la BD.
     * @param {string} nombre - El nombre a validar.
     */
    static validar(nombre) {
        if (!nombre || nombre.trim().length === 0) {
            // Lanza un error si el nombre está vacío o solo contiene espacios
            throw new Error('El nombre no puede estar vacío');
        }
        if (nombre.length > 50) {
            // Lanza un error si el nombre excede el límite
            throw new Error('El nombre no puede tener más de 50 caracteres');
        }
        return true;
    }
}