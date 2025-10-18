import { NestFactory } from '@nestjs/core';
import { AppModule } from './event.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
