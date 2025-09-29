import { Module } from '@nestjs/common';
import { EspecificacionesService } from './especificaciones.service';
import { EspecificacionesController } from './especificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especificacion } from './entities/especificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especificacion])],
  controllers: [EspecificacionesController],
  providers: [EspecificacionesService],
})
export class EspecificacionesModule {}
