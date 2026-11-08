export interface UsuarioSesion {
  username: string;
  role: string;
  issuedAt?: number;
  expiresAt?: number;
}