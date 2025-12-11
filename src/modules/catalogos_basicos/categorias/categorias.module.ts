import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { EstadosModule } from '../estados/estados.module';
import { R2Module } from '../../../common/r2.module';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), EstadosModule, R2Module],

  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule { }
