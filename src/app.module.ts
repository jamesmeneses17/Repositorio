import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubcategoriasModule } from './modules/catalogos_basicos/subcategorias/subcategorias.module';
import { CategoriasModule } from './modules/catalogos_basicos/categorias/categorias.module';
import { MarcasModule } from './modules/catalogos_basicos/marcas/marcas.module';
import { UnidadesMedidaModule } from './modules/catalogos_basicos/unidades-medida/unidades-medida.module';
import { EspecificacionesModule } from './modules/catalogos_basicos/especificaciones/especificaciones.module';
import { ProductosModule } from './modules/gestion_producto/productos/productos.module';
import { ProductosCaracteristicasModule } from './modules/gestion_producto/productos-caracteristicas/productos-caracteristicas.module';
import { InventarioModule } from './modules/gestion_producto/inventario/inventario.module';
import { PreciosModule } from './modules/gestion_producto/precios/precios.module';
import { TiposDocumentoModule } from './modules/cliente-administracion/tipos-documento/tipos-documento.module';
import { FacturasModule } from './modules/facturacion/facturas/facturas.module';
import { UsuariosAdminModule } from './modules/cliente-administracion/usuarios-admin/usuarios-admin.module';
import { MetodosPagoModule } from './modules/cliente-administracion/metodos-pago/metodos-pago.module';
import { ClientesModule } from './modules/cliente-administracion/clientes/clientes.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>('DB_HOST', 'localhost'),
      port: Number(config.get<string>('DB_PORT') ?? 3306),
      username: config.get('DB_USER'),
      password: config.get('DB_PASS'),
      database: config.get('DB_NAME'),
      autoLoadEntities: true,
      synchronize: false,
    }),
  }),
    CategoriasModule,
    SubcategoriasModule,
    MarcasModule,
    UnidadesMedidaModule,
    EspecificacionesModule,
    ProductosModule,
    ProductosCaracteristicasModule,
    InventarioModule,
    PreciosModule,
    TiposDocumentoModule,
    ClientesModule,
    MetodosPagoModule,
    UsuariosAdminModule,
    FacturasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
