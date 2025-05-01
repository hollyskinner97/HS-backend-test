import { DeliveryService } from './delivery.service';

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;

  const validId = '618f4ed6-1c5b-4993-a149-f64700bf31dd';
  const twoCatsId = 'ddd21c3a-c45e-4d5a-b3a4-a6851d58a351';
  const threeCatsId = 'ea17433d-7527-45a5-acbc-2e2f78f95c6e';
  const mixedCatsId = '76d6eb8d-5c2e-49f7-b798-d69700dda4c3';
  const noCatsId = '00000000-0000-0000-0000-000000000000';
  const invalidId = '!@#';

  beforeEach(() => {
    deliveryService = new DeliveryService();
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

    it('should return undefined when given an invalid userId', () => {
      const result = deliveryService.getUserDataById(invalidId);
      expect(result).toBeUndefined();
    });
  });

  describe('formatActiveCatNames', () => {
    it('should return null when given an user with no active cats', () => {
      const result = deliveryService.formatActiveCatNames(noCatsId);
      expect(result).toBe(null);
    });

    it('should return the correct string for a single active cat', () => {
      const result = deliveryService.formatActiveCatNames(validId);
      expect(result).toBe('Betsy');
    });

    it('should return the correct string for 2 active cats', () => {
      const result = deliveryService.formatActiveCatNames(twoCatsId);
      expect(result).toBe('Willie and Chaz');
    });

    it('should return the correct string for 3 or more active cats', () => {
      const result = deliveryService.formatActiveCatNames(threeCatsId);
      expect(result).toBe('Cristina, Mariah and Rebekah');
    });

    it('should return the correct string for a user with both active and inactive cats', () => {
      const result = deliveryService.formatActiveCatNames(mixedCatsId);
      expect(result).toBe('Destiny and Alexandre');
    });
  });

  describe('createTitle', () => {
    it('should return null when given an user with no cats', () => {
      const result = deliveryService.createTitle(noCatsId);
      expect(result).toBe(null);
    });

    it('should return the correct title for a given user', () => {
      const result = deliveryService.createTitle(validId);
      expect(result).toBe('Your next delivery for Betsy');

      const result2 = deliveryService.createTitle(twoCatsId);
      expect(result2).toBe('Your next delivery for Willie and Chaz');

      const result3 = deliveryService.createTitle(threeCatsId);
      expect(result3).toBe(
        'Your next delivery for Cristina, Mariah and Rebekah',
      );
    });
  });

  describe('createMessage', () => {
    it('should return null when given an user with no cats', () => {
      const result = deliveryService.createMessage(noCatsId);
      expect(result).toBe(null);
    });

    it('should return the correct title for a given user', () => {
      const result = deliveryService.createMessage(validId);
      expect(result).toBe(
        "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
      );

      const result2 = deliveryService.createMessage(twoCatsId);
      expect(result2).toBe(
        "Hey Herman! In two days' time, we'll be charging you for your next order for Willie and Chaz's fresh food.",
      );

      const result3 = deliveryService.createMessage(threeCatsId);
      expect(result3).toBe(
        "Hey Santiago! In two days' time, we'll be charging you for your next order for Cristina, Mariah and Rebekah's fresh food.",
      );
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return 0 when given an user with no cats', () => {
      const result = deliveryService.calculateTotalPrice(noCatsId);
      expect(result).toBe(0);
    });

    it('should return the correct total for a given user', () => {
      const result = deliveryService.calculateTotalPrice(validId);
      expect(result).toBe(69.0);

      const result2 = deliveryService.calculateTotalPrice(twoCatsId);
      expect(result2).toBe(125.5);

      const result3 = deliveryService.calculateTotalPrice(threeCatsId);
      expect(result3).toBe(197.5);
    });
  });

  describe('isEligibleForFreeGift', () => {
    it('should return false when given an user with no cats', () => {
      const result = deliveryService.isEligibleForFreeGift(noCatsId);
      expect(result).toBe(false);
    });

    it('should return false when the order total is <120', () => {
      const result = deliveryService.isEligibleForFreeGift(validId);
      expect(result).toBe(false);
    });

    it('should return true when the order total is >120', () => {
      const result = deliveryService.isEligibleForFreeGift(twoCatsId);
      expect(result).toBe(true);
    });
  });

  describe('generateUserDeliveryComms', () => {
    it('should return an object which combines the results of the helper functions', () => {
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
