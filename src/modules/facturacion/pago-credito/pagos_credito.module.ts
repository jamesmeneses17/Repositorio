// src/pagos_credito/pagos_credito.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosCreditoController } from './pagos_credito.controller';
import { Credito } from '../creditos/entities/creditos.entity';
import { PagosCredito } from './entities/pago-credito.entity';
import { PagosCreditoService } from './pagos-credito.service';
@Module({
  imports: [TypeOrmModule.forFeature([PagosCredito, Credito])],
  controllers: [PagosCreditoController],
  providers: [PagosCreditoService],
})
export class PagosCreditoModule {}
