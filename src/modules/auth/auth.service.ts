// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioAdmin } from '../cliente-administracion/usuarios-admin/entities/usuarios-admin.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioAdmin)
        private readonly usuarioRepo: Repository<UsuarioAdmin>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(correo: string, contrasena: string) {
        console.log('=== DEBUG AUTH ===');
        console.log('Correo recibido:', correo);
        console.log('Contraseña recibida:', contrasena);
        console.log('Tipo de contraseña recibida:', typeof contrasena);
        console.log('Longitud contraseña recibida:', contrasena.length);

        const user = await this.usuarioRepo.findOne({ where: { correo } });

        if (!user) {
            console.log(' Usuario NO encontrado en BD');
            throw new UnauthorizedException('Credenciales inválidas');
        }


        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.correo, loginDto.contrasena);
        const payload = { sub: user.id, correo: user.correo, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
        };
    }
}
