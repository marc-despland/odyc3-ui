import {
  describe,
  ddescribe,
  expect,
  iit,
  it
} from '@angular/core/testing';
import {Game} from './game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(new Game()).toBeTruthy();
  });
});
