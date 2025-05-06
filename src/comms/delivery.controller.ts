import { Controller, Get, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('comms/your-next-delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':userId')
  getUserDeliveryComms(@Param('userId') userId: string) {
    return this.deliveryService.generateUserDeliveryComms(userId);
  }
}
