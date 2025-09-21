import { Module } from '@nestjs/common';
import { FichasTecnicasService } from './fichas-tecnicas.service';
import { FichasTecnicasController } from './fichas-tecnicas.controller';

@Module({
  controllers: [FichasTecnicasController],
  providers: [FichasTecnicasService],
})
export class FichasTecnicasModule {}
