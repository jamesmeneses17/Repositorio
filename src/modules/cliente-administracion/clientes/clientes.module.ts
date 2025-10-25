// src/clientes/clientes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';

@Module({
  imports: [
    // Registra la entidad Cliente en el módulo de TypeORM
    TypeOrmModule.forFeature([Cliente]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  // Exporta el servicio si otras partes de la aplicación lo necesitan
  exports: [ClientesService], 
})
export class ClientesModule {}