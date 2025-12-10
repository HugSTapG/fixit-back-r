import { Controller, Post, Body, HttpCode, Request, UseGuards, Put } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Public } from '@app/shared';
import { AuthProxyService } from '../proxy/services/auth-proxy.service';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authProxyService: AuthProxyService) { }

    @Public()
    @Post('login')
    @HttpCode(200)
    login(@Body() loginDto: any): Observable<any> {
        return this.authProxyService.login(loginDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(200)
    refresh(@Body() refreshTokenDto: any): Observable<any> {
        return this.authProxyService.refresh(refreshTokenDto);
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    logout(@Request() req: ExpressRequest): Observable<any> {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Authorization token missing');
        }

        return this.authProxyService.logout(token);
    }

    @Put('switch-role')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    switchRole(
        @Request() req: ExpressRequest,
        @Body() body: { nuevoRol: string },
    ): Observable<any> {
        const userId = (req.user as any)?.sub;

        if (!userId) {
            throw new Error('User ID not found in token');
        }

        return this.authProxyService.switchRole(userId, body);
    }
}
