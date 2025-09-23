import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dto';
import { AUTH_PATTERNS } from '@app/events';

@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @MessagePattern(AUTH_PATTERNS.LOGIN)
    async login(@Payload() loginDto: LoginDto) {
        try {
            this.logger.log(`Login attempt for email: ${loginDto.email}`);
            const result = await this.authService.login(loginDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Login failed for email: ${loginDto.email}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.REFRESH)
    async refresh(@Payload() refreshTokenDto: RefreshTokenDto) {
        try {
            this.logger.log('Token refresh attempt');
            const result = await this.authService.refresh(refreshTokenDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Token refresh failed', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.LOGOUT)
    async logout(@Payload() data: { token: string }) {
        try {
            this.logger.log('Logout attempt');
            await this.authService.logout(data.token);
            return { success: true, message: 'Logout successful' };
        } catch (error) {
            this.logger.error('Logout failed', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE)
    async validateToken(@Payload() data: { token: string }) {
        try {
            this.logger.log('Token validation attempt');
            const result = await this.authService.validateToken(data.token);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Token validation failed', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}
