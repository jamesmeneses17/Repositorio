import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fichas_tecnicas')
export class FichaTecnica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  archivo_url: string;
}
