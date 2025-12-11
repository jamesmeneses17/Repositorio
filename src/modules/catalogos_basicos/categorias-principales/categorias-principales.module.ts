import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasPrincipalesService } from './categorias-principales.service';
import { CategoriasPrincipalesController } from './categorias-principales.controller';
import { CategoriaPrincipal } from './entitiies/categoria-principal.entity';
import { R2Module } from '../../../common/r2.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaPrincipal]), R2Module],
  controllers: [CategoriasPrincipalesController],
  providers: [CategoriasPrincipalesService],
})
export class CategoriasPrincipalesModule {}
