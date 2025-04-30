import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryModule } from './comms/delivery.module';

@Module({
  imports: [DeliveryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
