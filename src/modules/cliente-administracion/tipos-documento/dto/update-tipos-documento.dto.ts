// src/tipos-documento/dto/update-tipo-documento.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDocumentoDto } from './create-tipos-documento.dto';

// Permite que todos los campos de CreateTipoDocumentoDto sean opcionales para la actualización
export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {}