// src/pagos_credito/pagos_credito.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Credito } from '../creditos/entities/creditos.entity';
import { CreditoEstado } from '../creditos/credito-estado.enum';
import { PagosCredito } from './entities/pago-credito.entity';
import { CreatePagoCreditoDto } from './dtos/create-pago-credito.dto';

@Injectable()
export class PagosCreditoService {
  constructor(
    @InjectRepository(PagosCredito)
    private readonly pagosRepo: Repository<PagosCredito>,

    @InjectRepository(Credito)
    private readonly creditosRepo: Repository<Credito>,

    private readonly dataSource: DataSource,
  ) {}

  async registrarPago(dto: CreatePagoCreditoDto) {
    return await this.dataSource.transaction(async (manager) => {
      const credito = await manager.findOne(Credito, {
        where: { id: dto.credito_id },
      });

      if (!credito) {
        throw new BadRequestException('El crédito no existe');
      }

      if (credito.estado === CreditoEstado.PAGADO) {
        throw new BadRequestException('Este crédito ya está pagado');
      }

      if (dto.monto_pago > credito.saldo_pendiente) {
        throw new BadRequestException(
          `El pago excede el saldo pendiente (${credito.saldo_pendiente})`,
        );
      }

      // 1. Registrar el pago
      const pago = manager.create(PagosCredito, {
        credito_id: dto.credito_id,
        monto_pago: dto.monto_pago,
      });

      await manager.save(pago);

      // 2. Actualizar saldo del crédito
      credito.saldo_pendiente -= dto.monto_pago;

      // 3. Si saldo es 0 → marcar como PAGADO
      if (credito.saldo_pendiente <= 0) {
        credito.saldo_pendiente = 0;
        credito.estado = CreditoEstado.PAGADO;
      }

      await manager.save(credito);

      return {
        mensaje: 'Pago registrado correctamente',
        nuevo_saldo: credito.saldo_pendiente,
        estado: credito.estado,
      };
    });
  }
}
