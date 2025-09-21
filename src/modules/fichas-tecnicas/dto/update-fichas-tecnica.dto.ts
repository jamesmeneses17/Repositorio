import { PartialType } from '@nestjs/swagger';
import { CreateFichaTecnicaDto } from './create-fichas-tecnica.dto';

export class UpdateFichaTecnicaDto extends PartialType(CreateFichaTecnicaDto) {}
