import { RolUsuario } from '@app/shared';

export interface Usuario {
  idUser: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  passwordHash?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  roles: RolUsuario[];
  emailVerificado: boolean;
  activo: boolean;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsuarioSinPassword extends Omit<Usuario, 'password' | 'passwordHash'> {}

export interface CreateUsuarioData {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  roles?: RolUsuario[];
}

export interface UpdateUsuarioData {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}