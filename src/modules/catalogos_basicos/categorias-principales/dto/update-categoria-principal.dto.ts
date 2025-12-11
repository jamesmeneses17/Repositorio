import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaPrincipalDto } from './create-categoria-principal.dto';

export class UpdateCategoriaPrincipalDto extends PartialType(CreateCategoriaPrincipalDto) {}
