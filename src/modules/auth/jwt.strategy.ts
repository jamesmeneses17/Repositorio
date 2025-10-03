import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('🔑 JWT Strategy - Configurando con secreto:', 'secretKey');
    console.log('🔑 JWT_SECRET env var:', process.env.JWT_SECRET || 'undefined');
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Prioridad 1: Header Authorization Bearer
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Prioridad 2: Cookie auth_token (fallback)
        (req) => req?.cookies?.['auth_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecreto',
    });
  }

  async validate(payload: any) {
    console.log('🔍 JWT Strategy - Validando payload:', payload);
    
    // Validación básica del payload
    if (!payload.sub || !payload.correo) {
      console.log('❌ Payload inválido - faltan campos requeridos');
      throw new UnauthorizedException('Token inválido - Payload incompleto');
    }
    
    console.log('✅ Payload válido para usuario:', payload.correo);
    
    // Retornar la información del usuario desde el payload
    return {
      id: payload.sub,
      correo: payload.correo,
      nombre: payload.nombre || 'Usuario',
      rol: payload.rol || 'user',
    };
  }
}
