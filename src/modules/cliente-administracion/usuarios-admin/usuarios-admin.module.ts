import { Module } from '@nestjs/common';
import { UsuariosAdminService } from './usuarios-admin.service';
import { UsuariosAdminController } from './usuarios-admin.controller';

@Module({
  controllers: [UsuariosAdminController],
  providers: [UsuariosAdminService],
})
export class UsuariosAdminModule {}
