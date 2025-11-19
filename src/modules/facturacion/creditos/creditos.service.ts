// src/creditos/creditos.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito, CreditoEstado } from './entities/creditos.entity';
import { CreateCreditoDto } from './dtos/create-credito.dto';

@Injectable()
export class CreditosService {
    constructor(
        @InjectRepository(Credito)
        private readonly repo: Repository<Credito>,
    ) { }

    async crearCredito(dto: CreateCreditoDto) {
        const credito = this.repo.create({
            ...dto,
            saldo_pendiente: dto.valor_credito,
            estado: CreditoEstado.PENDIENTE,
        });

        return this.repo.save(credito);
    }

    async listar() {
        return this.repo.find({ order: { id: 'DESC' } });
    }

    async buscar(id: number) {
        return this.repo.findOne({ where: { id } });
    }
}
