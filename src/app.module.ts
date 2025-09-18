    import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { ConfigModule, ConfigService } from '@nestjs/config';
    import { UsuariosAdminModule } from './modules/usuarios-admin/usuarios-admin.module';
import { CategoriasModule } from './modules/categorias/categorias.module';


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
          synchronize: true,
        }),
      }),
        UsuariosAdminModule,
        CategoriasModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule { }
