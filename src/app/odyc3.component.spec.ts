import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Odyc3AppComponent } from '../app/odyc3.component';

beforeEachProviders(() => [Odyc3AppComponent]);

describe('App: Odyc3', () => {
  it('should create the app',
      inject([Odyc3AppComponent], (app: Odyc3AppComponent) => {
    expect(app).toBeTruthy();
  }));

});
