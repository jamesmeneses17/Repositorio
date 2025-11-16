import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';

import { Compra } from './entities/compra.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, Inventario])
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
