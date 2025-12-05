import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { EstadosModule } from '../../catalogos_basicos/estados/estados.module';
import { InventarioModule } from '../inventario/inventario.module';
import { PreciosModule } from '../precios/precios.module';
import { R2Module } from '../../../common/r2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    EstadosModule,
    InventarioModule,
    PreciosModule,
    R2Module,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }