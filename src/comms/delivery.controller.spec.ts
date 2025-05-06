import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DeliveryController', () => {
  let deliveryController: DeliveryController;
  let deliveryService: jest.Mocked<DeliveryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: DeliveryService,
          useValue: { generateUserDeliveryComms: jest.fn() },
        },
      ],
    }).compile();

    deliveryController = module.get<DeliveryController>(DeliveryController);
    deliveryService = module.get(
      DeliveryService,
    ) as jest.Mocked<DeliveryService>;
  });

  describe('getUserDeliveryComms', () => {
    const validId = '618f4ed6-1c5b-4993-a149-f64700bf31dd';
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const invalidId = '!@#';

    const mockCommsData = {
      title: 'Your next delivery for Betsy',
      message:
        "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
      totalPrice: 69.0,
      freeGift: false,
    };

    it('should return 200 OK and an object with the correct properties when called with a valid userId', () => {
      deliveryService.generateUserDeliveryComms.mockReturnValue(mockCommsData);
      const result = deliveryController.getUserDeliveryComms(validId);

      expect(deliveryService.generateUserDeliveryComms).toHaveBeenCalledWith(
        validId,
      );
      expect(result).toMatchObject({
        title: expect.any(String),
        message: expect.any(String),
        totalPrice: expect.any(Number),
        freeGift: expect.any(Boolean),
      });
    });

    it('should return 404 Not Found when userId is valid but does not exist', () => {
      deliveryService.generateUserDeliveryComms.mockImplementation(() => {
        throw new NotFoundException();
      });
      expect(() =>
        deliveryController.getUserDeliveryComms(nonExistentId),
      ).toThrow(NotFoundException);
    });

    it('should return 400 Bad Request when userId is an invalid format', () => {
      deliveryService.generateUserDeliveryComms.mockImplementation(() => {
        throw new BadRequestException();
      });
      expect(() => deliveryController.getUserDeliveryComms(invalidId)).toThrow(
        BadRequestException,
      );
    });

    it('should return 200 OK with the correctly populated object for a given user', () => {
      deliveryService.generateUserDeliveryComms.mockReturnValue(mockCommsData);
      const result = deliveryController.getUserDeliveryComms(validId);

      expect(result).toEqual(mockCommsData);
    });
  });
});
