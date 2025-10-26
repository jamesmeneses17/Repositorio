// src/tipos-documento/tipos-documento.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { TiposDocumentoService } from './tipos-documento.service';
import { TiposDocumentoController } from './tipos-documento.controller';
import { TipoDocumento } from './entities/tipos-documento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoDocumento]), // Importa la entidad para el repositorio
  ],
  controllers: [TiposDocumentoController],
  providers: [TiposDocumentoService],
  exports: [TiposDocumentoService], // Exporta el servicio para que otros módulos (como Clientes) puedan usarlo
})
export class TiposDocumentoModule {}