import { Module } from '@nestjs/common';
import { ProductosCaracteristicasService } from './productos-caracteristicas.service';
import { ProductosCaracteristicasController } from './productos-caracteristicas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoCaracteristica } from './entities/productos-caracteristica.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoCaracteristica])],

  controllers: [ProductosCaracteristicasController],
  providers: [ProductosCaracteristicasService],
})
export class ProductosCaracteristicasModule { }
