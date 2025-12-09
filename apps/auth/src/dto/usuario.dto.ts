import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, IsInt, IsOptional, IsBoolean, MinLength, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { RolUsuario } from '@app/shared';

export class CreateUsuarioDto {
    @IsNotEmpty({ message: 'Cédula es obligatoria' })
    @IsString({ message: 'Cédula debe ser una cadena' })
    @Length(10, 10, { message: 'Cédula debe tener exactamente 10 caracteres' })
    cedula: string;

    @IsNotEmpty({ message: 'Nombres son obligatorios' })
    @IsString({ message: 'Nombres debe ser una cadena' })
    @Length(1, 40, { message: 'Nombres debe tener entre 1 y 40 caracteres' })
    nombres: string;

    @IsNotEmpty({ message: 'Apellidos son obligatorios' })
    @IsString({ message: 'Apellidos debe ser una cadena' })
    @Length(1, 40, { message: 'Apellidos debe tener entre 1 y 40 caracteres' })
    apellidos: string;

    @IsNotEmpty({ message: 'Email es obligatorio' })
    @IsEmail({}, { message: 'Email debe ser válido' })
    @Length(5, 50, { message: 'Email debe tener entre 5 y 50 caracteres' })
    email: string;

    @IsOptional()
    @IsString({ message: 'Teléfono debe ser una cadena' })
    @Length(1, 20, { message: 'Teléfono debe tener entre 1 y 20 caracteres' })
    telefono?: string;

    @IsNotEmpty({ message: 'Password es obligatorio' })
    @IsString({ message: 'Password debe ser una cadena' })
    @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'Rol es obligatorio' })
    @IsEnum(RolUsuario, { message: 'Rol debe ser válido' })
    rol: RolUsuario;

    @IsOptional()
    @IsBoolean()
    emailVerificado?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsOptional()
    @IsInt()
    updatedBy?: number;
}

export class SwitchRoleDto {
    @IsNotEmpty({ message: 'Nuevo rol es obligatorio' })
    @IsIn([RolUsuario.TECNICO, RolUsuario.CLIENTE], {
        message: 'El rol debe ser TECNICO o CLIENTE'
    })
    nuevoRol: RolUsuario;
}
