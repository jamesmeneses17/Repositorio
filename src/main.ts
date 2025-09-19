import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const swaggerUser = configService.get<string>('SWAGGER_USER');
  const swaggerPass = configService.get<string>('SWAGGER_PASS');

  if (!swaggerUser || !swaggerPass) {
    throw new Error('Las variables SWAGGER_USER y SWAGGER_PASS deben estar definidas en el entorno');
  }

  // Protección de Swagger con user/contraseña
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPass,
      },
    }),
  );

  console.log('Conectando a BD:', {
    host: configService.get('MYSQL_HOST'),
    port: configService.get('MYSQL_PORT'),
    user: configService.get('MYSQL_USER'),
    database: configService.get('MYSQL_DATABASE'),
  });

  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Sistema de Ventas API')
    .setDescription('API para gestión de productos, usuarios y facturas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
