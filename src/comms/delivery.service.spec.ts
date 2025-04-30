import { DeliveryService } from './delivery.service';
import * as fs from 'fs';
import * as path from 'path';

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;
  let userData: any[];

  beforeEach(() => {
    deliveryService = new DeliveryService();

    const filePath = path.resolve(__dirname, '../../data.json');
    userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  });

  describe('getDataByUserId', () => {
    it('should return the user data for a given valid userId', () => {
      const expectedUserData = {
        id: '618f4ed6-1c5b-4993-a149-f64700bf31dd',
        firstName: 'Cordell',
        lastName: 'Koepp-Torphy',
        email: 'Cordell.Koepp-Torphy23@hotmail.com',
        cats: [
          {
            name: 'Betsy',
            subscriptionActive: true,
            breed: 'Savannah',
            pouchSize: 'E',
          },
        ],
      };
      const result = deliveryService.getUserDataById(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toEqual(expectedUserData);
    });

    it('should return undefined when given an invalid userId', () => {
      const result = deliveryService.getUserDataById('invalid-id');
      expect(result).toBeUndefined();
    });
  });

  describe('formatActiveCatNames', () => {
    it('should return null when given an user with no active cats', () => {
      const result = deliveryService.formatActiveCatNames(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(result).toBe(null);
    });

    it('should return the correct string for a single active cat', () => {
      const result = deliveryService.formatActiveCatNames(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toBe('Betsy');
    });

    it('should return the correct string for 2 active cats', () => {
      const result = deliveryService.formatActiveCatNames(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result).toBe('Willie and Chaz');
    });

    it('should return the correct string for 3 or more active cats', () => {
      const result = deliveryService.formatActiveCatNames(
        'ea17433d-7527-45a5-acbc-2e2f78f95c6e',
      );
      expect(result).toBe('Cristina, Mariah and Rebekah');
    });

    it('should return the correct string for a user with both active and inactive cats', () => {
      const result = deliveryService.formatActiveCatNames(
        '76d6eb8d-5c2e-49f7-b798-d69700dda4c3',
      );
      expect(result).toBe('Destiny and Alexandre');
    });
  });

  describe('createTitle', () => {
    it('should return null when given an user with no cats', () => {
      const result = deliveryService.createTitle(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(result).toBe(null);
    });

    it('should return the correct title for a given user', () => {
      const result = deliveryService.createTitle(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toBe('Your next delivery for Betsy');

      const result2 = deliveryService.createTitle(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result2).toBe('Your next delivery for Willie and Chaz');

      const result3 = deliveryService.createTitle(
        'ea17433d-7527-45a5-acbc-2e2f78f95c6e',
      );
      expect(result3).toBe(
        'Your next delivery for Cristina, Mariah and Rebekah',
      );
    });
  });

  describe('createMessage', () => {
    it('should return null when given an user with no cats', () => {
      const result = deliveryService.createMessage(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(result).toBe(null);
    });

    it('should return the correct title for a given user', () => {
      const result = deliveryService.createMessage(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toBe(
        "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
      );

      const result2 = deliveryService.createMessage(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result2).toBe(
        "Hey Herman! In two days' time, we'll be charging you for your next order for Willie and Chaz's fresh food.",
      );

      const result3 = deliveryService.createMessage(
        'ea17433d-7527-45a5-acbc-2e2f78f95c6e',
      );
      expect(result3).toBe(
        "Hey Santiago! In two days' time, we'll be charging you for your next order for Cristina, Mariah and Rebekah's fresh food.",
      );
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return 0 when given an user with no cats', () => {
      const result = deliveryService.calculateTotalPrice(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(result).toBe(0);
    });

    it('should return the correct total for a given user', () => {
      const result = deliveryService.calculateTotalPrice(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toBe(69.0);

      const result2 = deliveryService.calculateTotalPrice(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result2).toBe(125.5);

      const result3 = deliveryService.calculateTotalPrice(
        'ea17433d-7527-45a5-acbc-2e2f78f95c6e',
      );
      expect(result3).toBe(197.5);
    });
  });

  describe('isEligibleForFreeGift', () => {
    it('should return false when given an user with no cats', () => {
      const result = deliveryService.isEligibleForFreeGift(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(result).toBe(false);
    });

    it('should return false when the order total is <120', () => {
      const result = deliveryService.isEligibleForFreeGift(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
      expect(result).toBe(false);
    });

    it('should return true when the order total is >120', () => {
      const result2 = deliveryService.isEligibleForFreeGift(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result2).toBe(true);
    });
  });

  describe('generateUserDeliveryComms', () => {
    it('should return an object which combines the results of the helper functions', () => {
      const result = deliveryService.generateUserDeliveryComms(
        'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351',
      );
      expect(result).toEqual({
        title: 'Your next delivery for Willie and Chaz',
        message:
          "Hey Herman! In two days' time, we'll be charging you for your next order for Willie and Chaz's fresh food.",
        totalPrice: 125.5,
        freeGift: true,
      });
    });
  });
});
