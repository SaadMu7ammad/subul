import {
  CharityTestingEnvironment,
  UsedItemTestingEnvironment,
  UserTestingEnvironment,
} from './testing-environments';

export * from './charity-test-helpers';
export * from './shared-test-helpers';
export * from './usedItem-test-helpers';
export * from './user-test-helpers';
export * from './testing-environments';

export const authenticatedUserTestingEnvironment = new UserTestingEnvironment({
  authenticated: true,
  usedDbs: ['user', 'usedItem'],
});
export const unauthenticatedUserTestingEnvironment = new CharityTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity'],
});
export const authenticatedCharityTestingEnvironment = new CharityTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity'],
});
export const unauthenticatedCharityTestingEnvironment = new CharityTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity'],
});
export const usedItemTestingEnvironment = new UsedItemTestingEnvironment({
  authenticated: true,
  usedDbs: ['charity', 'usedItem', 'user'],
});
