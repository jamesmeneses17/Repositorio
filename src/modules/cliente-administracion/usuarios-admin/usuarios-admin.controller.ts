import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosAdminService } from './usuarios-admin.service';
import { CreateUsuariosAdminDto } from './dto/create-usuarios-admin.dto';
import { UpdateUsuariosAdminDto } from './dto/update-usuarios-admin.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('usuarios-admin')
@Controller('usuarios-admin')
export class UsuariosAdminController {
  constructor(private readonly usuariosAdminService: UsuariosAdminService) {}

  /**
   * Crear un nuevo usuario administrador
   */
  @Post()
  create(@Body() createUsuariosAdminDto: CreateUsuariosAdminDto) {
    return this.usuariosAdminService.create(createUsuariosAdminDto);
  }

  /**
   * Listar todos los usuarios administradores
   */
  @Get()
  findAll() {
    return this.usuariosAdminService.findAll();
  }

  /**
   * Endpoint protegido para obtener el perfil del usuario autenticado
   * - Se valida con JWT
   * - Retorna solo los campos públicos: id, nombre, correo, rol
   * IMPORTANTE: Debe ir ANTES de @Get(':id') para evitar conflictos
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'Token no válido o no enviado' })
  @Get('me')
  async getProfile(@Request() req) {
    return this.usuariosAdminService.findOne(req.user.id);
  }

  /**
   * Obtener un usuario administrador por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosAdminService.findOne(+id);
  }

  /**
   * Actualizar un usuario administrador por ID
   */
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateUsuariosAdminDto: UpdateUsuariosAdminDto
  ) {
    return this.usuariosAdminService.update(+id, updateUsuariosAdminDto);
  }

  /**
   * Eliminar un usuario administrador por ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosAdminService.remove(+id);
  }

}
