import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('🔐 LOGIN - Datos recibidos:', loginDto);
    
    try {
      const result = await this.authService.login(loginDto);
      console.log('✅ LOGIN EXITOSO - Respuesta:', {
        message: 'Login exitoso',
        hasToken: !!result.access_token,
        tokenLength: result.access_token?.length,
        user: result.user?.correo
      });
      
      return {
        message: 'Login exitoso',
        ...result
      };
    } catch (error) {
      console.log('❌ ERROR EN LOGIN:', error.message);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user; // req.user lo llena Passport con el JWT payload
  }
}
