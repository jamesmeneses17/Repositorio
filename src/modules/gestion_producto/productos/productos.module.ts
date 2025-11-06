import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { EstadosModule } from '../../catalogos_basicos/estados/estados.module';
import { InventarioModule } from '../inventario/inventario.module';
import { PreciosModule } from '../precios/precios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    EstadosModule,
    InventarioModule,
    PreciosModule
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }