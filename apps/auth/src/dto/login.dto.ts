import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email debe ser válido' })
    @IsNotEmpty({ message: 'Email es obligatorio' })
    email: string;

    @IsString({ message: 'Password debe ser una cadena' })
    @IsNotEmpty({ message: 'Password es obligatorio' })
    @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
    password: string;
}

// También mantener compatibilidad con cédula si es necesario
export class LoginByCedulaDto {
    @IsNotEmpty({ message: 'Cédula es obligatoria' })
    @IsString({ message: 'Cédula debe ser una cadena' })
    cedula: string;

    @IsNotEmpty({ message: 'Password es obligatorio' })
    @IsString({ message: 'Password debe ser una cadena' })
    password: string;
}
