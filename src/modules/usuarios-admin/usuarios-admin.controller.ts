import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuariosAdminService } from './usuarios-admin.service';
import { CreateUsuarioAdminDto } from './dto/create-usuario-admin.dto';
import { UpdateUsuarioAdminDto } from './dto/update-usuario-admin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('usuarios-admin')
@Controller('usuarios-admin')
export class UsuariosAdminController {
  constructor(private readonly usuariosAdminService: UsuariosAdminService) {}

  @Get()
  findAll() {
    return this.usuariosAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosAdminService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUsuarioAdminDto) {
    return this.usuariosAdminService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioAdminDto) {
    return this.usuariosAdminService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosAdminService.remove(+id);
  }
}
