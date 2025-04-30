import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DeliveryController', () => {
  let deliveryController: DeliveryController;
  let deliveryService: jest.Mocked<DeliveryService>;

  beforeEach(async () => {
    const mockDeliveryService = { generateUserDeliveryComms: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [{ provide: DeliveryService, useValue: mockDeliveryService }],
    }).compile();

    deliveryController = module.get<DeliveryController>(DeliveryController);
    deliveryService = module.get(
      DeliveryService,
    ) as jest.Mocked<DeliveryService>;
  });

  describe('getUserDeliveryComms', () => {
    it('should call getUserDeliveryComms() and generateUserDeliveryComms() with the given userId', () => {
      const mockCommsData = {
        title: 'Your next delivery for Betsy',
        message:
          "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
        totalPrice: 69.0,
        freeGift: false,
      };

      deliveryService.generateUserDeliveryComms.mockReturnValue(mockCommsData);

      deliveryController.getUserDeliveryComms(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );

      expect(deliveryService.generateUserDeliveryComms).toHaveBeenCalledWith(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );
    });

    it('should return a 404 error when userId is valid but does not exist', () => {
      deliveryService.generateUserDeliveryComms.mockReturnValue(undefined);
      expect(() =>
        deliveryController.getUserDeliveryComms(
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toThrow(NotFoundException);
    });

    it('should return a 400 error when userId is an invalid format', () => {
      expect(() => deliveryController.getUserDeliveryComms('!@#')).toThrow(
        BadRequestException,
      );
    });

    it('should return an object with the correct properties', () => {
      const mockCommsData = {
        title: 'Your next delivery for Betsy',
        message:
          "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
        totalPrice: 69.0,
        freeGift: false,
      };

      deliveryService.generateUserDeliveryComms.mockReturnValue(mockCommsData);

      const result = deliveryController.getUserDeliveryComms(
        '618f4ed6-1c5b-4993-a149-f64700bf31dd',
      );

      expect(result).toMatchObject({
        title: expect.any(String),
        message: expect.any(String),
        totalPrice: expect.any(Number),
        freeGift: expect.any(Boolean),
      });
    });

    it('should call getUserDeliveryComms() and return the correct object for said user', () => {
      const mockCommsData = {
        title: 'Your next delivery for Betsy',
        message:
          "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
        totalPrice: 69.0,
        freeGift: false,
      };

      // Mock function return value
      deliveryService.generateUserDeliveryComms.mockReturnValue(mockCommsData);

      expect(
        deliveryController.getUserDeliveryComms(
          '618f4ed6-1c5b-4993-a149-f64700bf31dd',
        ),
      ).toEqual(mockCommsData);
    });
  });
});
