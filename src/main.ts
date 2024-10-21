import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';
import { RequestLoggingInterceptor } from './interceptor/request-logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas nos DTOs
    forbidNonWhitelisted: true, // Retorna erro para propriedades não definidas
    transform: true, // Transforma as variáveis para os tipos especificados
    validationError: { target: false }, // Para não incluir o objeto de entrada nos erros
  }));


  // Tratamento global de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor para logs de requisição
  app.useGlobalInterceptors(new RequestLoggingInterceptor());


  const config = new DocumentBuilder()
    .setTitle('Desafio CRUD API')
    .setDescription('API para realizar operações de CRUD de itens')
    .setContact('Leandro Cabeda Rigo', 'https://github.com/leandro-cabeda?tab=repositories', 'leandro.cabeda@hotmail.com')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
