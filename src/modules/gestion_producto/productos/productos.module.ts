import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { EstadosModule } from '../../catalogos_basicos/estados/estados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    EstadosModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }