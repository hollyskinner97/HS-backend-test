import { Injectable } from '@nestjs/common';
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

  // Gets the user data for a given userId
  getUserDataById(userId: string): User | undefined {
    return this.data.find((user) => user.id === userId);
  }

  // Returns a string of cat names with an active subscription, formatted correctly
  formatActiveCatNames(userId: string): string | null {
    const userData = this.getUserDataById(userId);
    if (!userData) return null;

    const activeCatNames = userData.cats
      .filter((cat) => cat.subscriptionActive) // Remove inactive cats
      .map((cat) => cat.name); // Extract names

    if (activeCatNames.length === 1) {
      return activeCatNames[0];
    } else if (activeCatNames.length === 2) {
      return `${activeCatNames[0]} and ${activeCatNames[1]}`;
    } else {
      const lastCat = activeCatNames.pop();
      return `${activeCatNames.join(', ')} and ${lastCat}`;
    }
  }

  // Returns the title of the delivery comms
  createTitle(userId: string): string | null {
    const formattedActiveCatNames = this.formatActiveCatNames(userId);
    if (!formattedActiveCatNames) return null;

    return `Your next delivery for ${formattedActiveCatNames}`;
  }

  // Returns the message for the delivery comms
  createMessage(userId: string): string | null {
    const userData = this.getUserDataById(userId);
    if (!userData) return null;

    const formattedActiveCatNames = this.formatActiveCatNames(userId);
    if (!formattedActiveCatNames) return null;

    return `Hey ${userData.firstName}! In two days' time, we'll be charging you for your next order for ${formattedActiveCatNames}'s fresh food.`;
  }

  // Calculates the total price of the pouches for a user's active cats
  calculateTotalPrice(userId: string): number {
    const userData = this.getUserDataById(userId);
    if (!userData) return 0;

    const activeCatPouches = userData.cats
      .filter((cat) => cat.subscriptionActive) // Remove inactive cats
      .map((cat) => cat.pouchSize); // Extract pouch sizes

    if (activeCatPouches.length === 0) return 0;

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
    if (!userData) return undefined;

    // Combine the results of the helper functions into 1 object
    return {
      title: this.createTitle(userId),
      message: this.createMessage(userId),
      totalPrice: this.calculateTotalPrice(userId),
      freeGift: this.isEligibleForFreeGift(userId),
    };
  }
}
