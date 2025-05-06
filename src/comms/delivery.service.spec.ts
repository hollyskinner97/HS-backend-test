import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;

  const validId = '618f4ed6-1c5b-4993-a149-f64700bf31dd';
  const twoCatsId = 'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351';
  const threeCatsId = 'ea17433d-7527-45a5-acbc-2e2f78f95c6e';
  const mixedCatsId = '76d6eb8d-5c2e-49f7-b798-d69700dda4c3';
  const noCatsId = '00000000-0000-0000-0000-000000000000';
  const invalidId = '!@#';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService],
    }).compile();

    deliveryService = module.get<DeliveryService>(DeliveryService);
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
      const result = deliveryService.getUserDataById(validId);
      expect(result).toEqual(expectedUserData);
    });

    it('should throw NotFoundException when given an unknown userId', () => {
      expect(() => deliveryService.getUserDataById(noCatsId)).toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when given an invalid userId', () => {
      expect(() => deliveryService.getUserDataById(invalidId)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('formatActiveCatNames', () => {
    it('should format cat names correctly based on the number of active cats', () => {
      expect(deliveryService.formatActiveCatNames(validId)).toBe('Betsy');
      expect(deliveryService.formatActiveCatNames(twoCatsId)).toBe(
        'Willie and Chaz',
      );
      expect(deliveryService.formatActiveCatNames(threeCatsId)).toBe(
        'Cristina, Mariah and Rebekah',
      );
      expect(deliveryService.formatActiveCatNames(mixedCatsId)).toBe(
        'Destiny and Alexandre',
      );
    });
  });

  describe('createTitle', () => {
    it('should return the correct title for a given user', () => {
      expect(deliveryService.createTitle(validId)).toBe(
        'Your next delivery for Betsy',
      );
      expect(deliveryService.createTitle(twoCatsId)).toBe(
        'Your next delivery for Willie and Chaz',
      );
      expect(deliveryService.createTitle(threeCatsId)).toBe(
        'Your next delivery for Cristina, Mariah and Rebekah',
      );
    });
  });

  describe('createMessage', () => {
    it('should return the correct title for a given user', () => {
      expect(deliveryService.createMessage(validId)).toBe(
        "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
      );
      expect(deliveryService.createMessage(twoCatsId)).toBe(
        "Hey Herman! In two days' time, we'll be charging you for your next order for Willie and Chaz's fresh food.",
      );
      expect(deliveryService.createMessage(threeCatsId)).toBe(
        "Hey Santiago! In two days' time, we'll be charging you for your next order for Cristina, Mariah and Rebekah's fresh food.",
      );
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return the correct total for a given user', () => {
      expect(deliveryService.calculateTotalPrice(validId)).toBe(69.0);
      expect(deliveryService.calculateTotalPrice(twoCatsId)).toBe(125.5);
      expect(deliveryService.calculateTotalPrice(threeCatsId)).toBe(197.5);
    });
  });

  describe('isEligibleForFreeGift', () => {
    it('should return false when the order total is <120', () => {
      expect(deliveryService.isEligibleForFreeGift(validId)).toBe(false);
    });

    it('should return true when the order total is >120', () => {
      expect(deliveryService.isEligibleForFreeGift(twoCatsId)).toBe(true);
    });
  });

  describe('generateUserDeliveryComms', () => {
    it('should correctly combine details into a formatted return object', () => {
      const result = deliveryService.generateUserDeliveryComms(twoCatsId);
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
