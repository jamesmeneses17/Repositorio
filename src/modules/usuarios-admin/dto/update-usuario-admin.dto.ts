import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioAdminDto } from './create-usuario-admin.dto';

export class UpdateUsuarioAdminDto extends PartialType(CreateUsuarioAdminDto) {}
