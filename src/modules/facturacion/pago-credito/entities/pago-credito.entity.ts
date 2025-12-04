// src/pagos_credito/entities/pagos_credito.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Credito } from '../../creditos/entities/creditos.entity';

@Entity('pagos_credito')
export class PagosCredito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credito_id: number;

  @ManyToOne(() => Credito, (c) => c.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'credito_id' })
  credito: Credito;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto_pago: number
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_pago: string;
}
