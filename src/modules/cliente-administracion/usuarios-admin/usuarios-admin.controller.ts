import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosAdminService } from './usuarios-admin.service';
import { CreateUsuariosAdminDto } from './dto/create-usuarios-admin.dto';
import { UpdateUsuariosAdminDto } from './dto/update-usuarios-admin.dto';

@Controller('usuarios-admin')
export class UsuariosAdminController {
  constructor(private readonly usuariosAdminService: UsuariosAdminService) {}

  @Post()
  create(@Body() createUsuariosAdminDto: CreateUsuariosAdminDto) {
    return this.usuariosAdminService.create(createUsuariosAdminDto);
  }

  @Get()
  findAll() {
    return this.usuariosAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuariosAdminDto: UpdateUsuariosAdminDto) {
    return this.usuariosAdminService.update(+id, updateUsuariosAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosAdminService.remove(+id);
  }
}
