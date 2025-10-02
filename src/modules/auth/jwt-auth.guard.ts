import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🛡️ JwtAuthGuard - Verificando autenticación...');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('🔍 Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log('❌ No se encontró Authorization header');
    } else if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization header no es tipo Bearer');
    } else {
      const token = authHeader.split(' ')[1];
      console.log('🎫 Token encontrado:', token ? token.substring(0, 20) + '...' : 'VACÍO');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔄 JwtAuthGuard - handleRequest resultado:');
    console.log('  - Error:', err);
    console.log('  - Usuario:', user);
    console.log('  - Info:', info);
    
    if (err || !user) {
      console.log('❌ Autenticación fallida');
      throw err || new UnauthorizedException('Token inválido o no enviado');
    }
    
    console.log('✅ Usuario autenticado exitosamente:', user.correo);
    return user;
  }
}
