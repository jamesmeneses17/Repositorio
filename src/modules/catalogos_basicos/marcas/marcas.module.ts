import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { Marca } from './entities/marca.entity';
import { EstadosModule } from '../estados/estados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marca]),
    EstadosModule,
  ],
  controllers: [MarcasController],
  providers: [MarcasService],
})
export class MarcasModule { }