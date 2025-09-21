import { Module } from '@nestjs/common';
import { EspecificacionesTecnicasService } from './especificaciones-tecnicas.service';
import { EspecificacionesTecnicasController } from './especificaciones-tecnicas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecificacionesTecnicas } from './entities/especificaciones-tecnica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EspecificacionesTecnicas])],
  controllers: [EspecificacionesTecnicasController],
  providers: [EspecificacionesTecnicasService],
})
export class EspecificacionesTecnicasModule { }
