import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreciosService } from './precios.service';
import { PreciosController } from './precios.controller';
import { Precio } from './entities/precio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Precio])],
  controllers: [PreciosController],
  providers: [PreciosService],
})
export class PreciosModule {}
