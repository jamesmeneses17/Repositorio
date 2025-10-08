import { Module } from '@nestjs/common';
import { SubcategoriasService } from './subcategorias.service';
import { SubcategoriasController } from './subcategorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { EstadosModule } from '../estados/estados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategoria, Categoria]),
    EstadosModule,
  ],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
})
export class SubcategoriasModule { }