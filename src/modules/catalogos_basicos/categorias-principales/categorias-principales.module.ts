import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasPrincipalesService } from './categorias-principales.service';
import { CategoriasPrincipalesController } from './categorias-principales.controller';
import { CategoriaPrincipal } from './entitiies/categoria-principal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaPrincipal])],
  controllers: [CategoriasPrincipalesController],
  providers: [CategoriasPrincipalesService],
})
export class CategoriasPrincipalesModule {}
