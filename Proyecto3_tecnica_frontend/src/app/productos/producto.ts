export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
  categoriaId: number;
  categoriaNombre?: string;
}