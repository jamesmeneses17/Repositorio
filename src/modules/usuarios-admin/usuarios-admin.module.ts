import { Module } from '@nestjs/common';
import { UsuariosAdminController } from './usuarios-admin.controller';
import { UsuariosAdminService } from './usuarios-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioAdmin } from './entities/usuarios-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioAdmin])],
  controllers: [UsuariosAdminController],
  providers: [UsuariosAdminService]
})
export class UsuariosAdminModule { }
