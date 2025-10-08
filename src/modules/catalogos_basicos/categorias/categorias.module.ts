import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { EstadosModule } from '../estados/estados.module';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), EstadosModule],

  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule { }
