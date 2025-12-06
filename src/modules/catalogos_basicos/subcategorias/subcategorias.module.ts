import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoriasController } from './subcategorias.controller';
import { SubcategoriasService } from './subcategorias.service';
import { Subcategoria } from './entities/subcategoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategoria]), // <--- FALTABA ESTO
  ],
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService],
  exports: [SubcategoriasService, TypeOrmModule], // <--- EXPÓRTALO SI OTRAS ENTIDADES LO USAN
})
export class SubcategoriasModule {}
