import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoriasController } from './subcategorias.controller';
import { SubcategoriasService } from './subcategorias.service';
import { Subcategoria } from './entities/subcategoria.entity';
import { R2Module } from '../../../common/r2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategoria]),
    R2Module,
  ],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
  exports: [SubcategoriasService, TypeOrmModule],
})
export class SubcategoriasModule {}
