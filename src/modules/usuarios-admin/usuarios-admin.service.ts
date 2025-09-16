import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioAdminDto } from './dto/create-usuario-admin.dto';
import { UpdateUsuarioAdminDto } from './dto/update-usuario-admin.dto';
import { UsuarioAdmin } from './entities/usuarios-admin.entity';

@Injectable()
export class UsuariosAdminService {
    constructor(
        @InjectRepository(UsuarioAdmin)
        private usuariosRepo: Repository<UsuarioAdmin>,
    ) { }

    findAll() {
        return this.usuariosRepo.find();
    }

    findOne(id: number) {
        return this.usuariosRepo.findOneBy({ id });
    }

    create(data: CreateUsuarioAdminDto) {
        const nuevoUsuario = this.usuariosRepo.create(data);
        return this.usuariosRepo.save(nuevoUsuario);
    }

    async update(id: number, data: UpdateUsuarioAdminDto) {
        await this.usuariosRepo.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.usuariosRepo.delete(id);
        return { deleted: true };
    }
}
