import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Marca } from '../marcas/entities/marca.entity';
import { Subcategoria } from '../subcategorias/entities/subcategoria.entity';
import { UnidadMedida } from '../unidades-medida/entities/unidades-medida.entity';
import { FichaTecnica } from '../fichas-tecnicas/entities/fichas-tecnica.entity';
import { EspecificacionesTecnicas } from '../especificaciones-tecnicas/entities/especificaciones-tecnica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Marca, Subcategoria, UnidadMedida, FichaTecnica, EspecificacionesTecnicas])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }
