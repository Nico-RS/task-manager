import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { welcome } from '../welcome';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setGlobalModifiers(app);
  await app.listen(process.env.PORT);
  welcome();
}
bootstrap();

const setGlobalModifiers = (appModule: INestApplication) => {
  appModule.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};
