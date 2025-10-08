import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { Estado } from './entities/estado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estado]),
  ],
  controllers: [EstadosController],
  providers: [EstadosService],
  exports: [TypeOrmModule.forFeature([Estado]), EstadosService],
})
export class EstadosModule { }