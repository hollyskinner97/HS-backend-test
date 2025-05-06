import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}

@Injectable()
export class DeliveryService {
  private data: User[];

  constructor() {
    const filePath = path.resolve(__dirname, '../../data.json');
    this.data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Helper function to validate userId format
  private isValidUserId(userId: string) {
    const userIdRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return userIdRegex.test(userId);
  }

  // Gets the user data for a given userId
  getUserDataById(userId: string): User {
    if (!this.isValidUserId(userId)) {
      throw new BadRequestException(`The userId ${userId} is invalid.`);
    }

    const user = this.data.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  // Returns a string of cat names with an active subscription, formatted correctly
  formatActiveCatNames(userId: string): string {
    const userData = this.getUserDataById(userId);

    const activeCatNames = userData.cats
      .filter((cat) => cat.subscriptionActive) // Remove inactive cats
      .map((cat) => cat.name); // Extract names

    // Not the case in our data but could have user with no active cats
    if (!activeCatNames || activeCatNames.length === 0) {
      return 'No active cats';
    }

    return activeCatNames.length === 1
      ? activeCatNames[0]
      : `${activeCatNames.slice(0, -1).join(', ')} and ${activeCatNames.at(-1)}`;
  }

  // Returns the title of the delivery comms
  createTitle(userId: string): string {
    const formattedActiveCatNames = this.formatActiveCatNames(userId);

    return `Your next delivery for ${formattedActiveCatNames}`;
  }

  // Returns the message for the delivery comms
  createMessage(userId: string): string {
    const userData = this.getUserDataById(userId);

    const formattedActiveCatNames = this.formatActiveCatNames(userId);

    return `Hey ${userData.firstName}! In two days' time, we'll be charging you for your next order for ${formattedActiveCatNames}'s fresh food.`;
  }

  // Calculates the total price of the pouches for a user's active cats
  calculateTotalPrice(userId: string): number {
    const userData = this.getUserDataById(userId);
    const activeCatPouches = userData.cats
      .filter((cat) => cat.subscriptionActive) // Remove inactive cats
      .map((cat) => cat.pouchSize); // Extract pouch sizes

    const pouchPrices: Record<string, number> = {
      A: 55.5,
      B: 59.5,
      C: 62.75,
      D: 66.0,
      E: 69.0,
      F: 71.25,
    };

    // Calculate total price by summing pouch size values
    return activeCatPouches.reduce(
      (total, pouchSize) => total + (pouchPrices[pouchSize] || 0),
      0,
    );
  }

  isEligibleForFreeGift(userId: string): boolean {
    const totalPrice = this.calculateTotalPrice(userId);

    // Return true if >120 or false if <120
    return totalPrice > 120;
  }

  generateUserDeliveryComms(userId: string) {
    const userData = this.getUserDataById(userId);

    // Combine the results of the helper functions into 1 object
    return {
      title: this.createTitle(userId),
      message: this.createMessage(userId),
      totalPrice: this.calculateTotalPrice(userId),
      freeGift: this.isEligibleForFreeGift(userId),
    };
  }
}
