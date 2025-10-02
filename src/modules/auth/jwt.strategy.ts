import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioAdmin } from '../cliente-administracion/usuarios-admin/entities/usuarios-admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsuarioAdmin)
    private readonly usuarioRepo: Repository<UsuarioAdmin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Prioridad 1: Header Authorization Bearer
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Prioridad 2: Cookie auth_token (fallback)
        (req) => req?.cookies?.['auth_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    console.log('🔍 JWT Strategy - Validando payload:', payload);
    
    // Buscar usuario en BD para confirmar que existe
    const user = await this.usuarioRepo.findOne({ 
      where: { id: payload.sub } 
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado en BD con ID:', payload.sub);
      throw new UnauthorizedException('Token inválido - Usuario no existe');
    }
    
    console.log('✅ Usuario validado:', user.nombre);
    return {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol,
    };
  }
}
