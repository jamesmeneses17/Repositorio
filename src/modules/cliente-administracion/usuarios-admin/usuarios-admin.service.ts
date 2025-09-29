import { Injectable } from '@nestjs/common';
import { CreateUsuariosAdminDto } from './dto/create-usuarios-admin.dto';
import { UpdateUsuariosAdminDto } from './dto/update-usuarios-admin.dto';

@Injectable()
export class UsuariosAdminService {
  create(createUsuariosAdminDto: CreateUsuariosAdminDto) {
    return 'This action adds a new usuariosAdmin';
  }

  findAll() {
    return `This action returns all usuariosAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuariosAdmin`;
  }

  update(id: number, updateUsuariosAdminDto: UpdateUsuariosAdminDto) {
    return `This action updates a #${id} usuariosAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuariosAdmin`;
  }
}
