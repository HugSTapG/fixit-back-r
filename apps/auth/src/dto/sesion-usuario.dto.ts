import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateSesionUsuarioDto {
    @IsNotEmpty()
    @IsInt()
    idUser: number;

    @IsNotEmpty()
    @IsString()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    refreshToken: string;

    @IsOptional()
    @IsString()
    userAgent?: string;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsNotEmpty()
    @IsDateString()
    expiresAt: Date;

    @IsNotEmpty()
    @IsDateString()
    refreshExpiresAt: Date;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateSesionUsuarioDto {
    @IsOptional()
    @IsString()
    accessToken?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: Date;

    @IsOptional()
    @IsDateString()
    refreshExpiresAt?: Date;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
