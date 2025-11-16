// src/ventas/ventas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';

@Module({
  imports: [
    // Registra la entidad Venta para que TypeORM pueda inyectar el repositorio
    TypeOrmModule.forFeature([Venta]), 
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService] // Exporta el servicio si necesitas usarlo en otros módulos
})
export class VentasModule {}