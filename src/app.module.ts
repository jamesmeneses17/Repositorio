import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosAdminModule } from './modules/usuarios-admin/usuarios-admin.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { SubcategoriasModule } from './modules/subcategorias/subcategorias.module';
import { MarcasModule } from './modules/marcas/marcas.module';
import { UnidadesMedidaModule } from './modules/unidades-medida/unidades-medida.module';
import { ProductosModule } from './modules/productos/productos.module';
import { EspecificacionesTecnicasModule } from './modules/especificaciones-tecnicas/especificaciones-tecnicas.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>('MYSQL_HOST', 'localhost'),
      port: Number(config.get<string>('MYSQL_PORT') ?? 3306),
      username: config.get('MYSQL_USER'),
      password: config.get('MYSQL_PASSWORD'),
      database: config.get('MYSQL_DATABASE'),
      autoLoadEntities: true,
      synchronize: false,
    }),
  }),
    UsuariosAdminModule,
    CategoriasModule,
    SubcategoriasModule,
    MarcasModule,
    UnidadesMedidaModule,
    ProductosModule,
    EspecificacionesTecnicasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
