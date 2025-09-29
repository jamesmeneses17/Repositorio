import { PartialType } from '@nestjs/swagger';
import { CreateUsuariosAdminDto } from './create-usuarios-admin.dto';

export class UpdateUsuariosAdminDto extends PartialType(CreateUsuariosAdminDto) {}
