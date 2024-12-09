import { CookieAndHeaderMiddleware } from './cookie-and-header.middleware';

describe('CookieAndHeaderMiddleware', () => {
  it('should be defined', () => {
    expect(new CookieAndHeaderMiddleware()).toBeDefined();
  });
});
