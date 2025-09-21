import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoriasService } from './subcategorias.service';
import { SubcategoriasController } from './subcategorias.controller';
import { Subcategoria } from './entities/subcategoria.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategoria, Categoria])],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
})
export class SubcategoriasModule {}
