// src/modules/configuracion_web/informacion_empresa/informacion-empresa.module.ts

import { Module } from '@nestjs/common';
// Importamos la entidad para que el ORM la reconozca
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacionEmpresa } from './entities/informacion-empresa.entity'; 
import { InformacionEmpresaController } from './informacion-empresa.controller';
import { InformacionEmpresaService } from './informacion-empresa.service';


@Module({
  imports: [
    // Registramos la entidad para que el servicio pueda usarla (Repository)
    TypeOrmModule.forFeature([InformacionEmpresa]),
  ],
  controllers: [InformacionEmpresaController],
  providers: [InformacionEmpresaService],
  exports: [InformacionEmpresaService], // Exportamos el servicio por si otros módulos lo necesitan
})
export class InformacionEmpresaModule {}