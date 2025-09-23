import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsNotEmpty({ message: 'Refresh token es obligatorio' })
    @IsString({ message: 'Refresh token debe ser una cadena' })
    refresh_token: string;
}
