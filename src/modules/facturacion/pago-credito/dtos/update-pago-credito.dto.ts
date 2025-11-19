import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoCreditoDto } from './create-pago-credito.dto';

export class UpdatePagoCreditoDto extends PartialType(CreatePagoCreditoDto) {}
