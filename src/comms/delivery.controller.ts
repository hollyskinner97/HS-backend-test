import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('comms/your-next-delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // Helper function to validate userId format
  private isValidUserId(userId: string): boolean {
    const userIdRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return userIdRegex.test(userId);
  }

  @Get(':userId')
  getUserDeliveryComms(@Param('userId') userId: string) {
    if (!this.isValidUserId(userId)) {
      throw new BadRequestException(`The user ID ${userId} is invalid`);
    }

    // Get comms data if the user is valid
    const commsData = this.deliveryService.generateUserDeliveryComms(userId);

    // Check if the user is on file and has comms data
    if (!commsData) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If data exists for the user, return it
    return commsData;
  }
}
