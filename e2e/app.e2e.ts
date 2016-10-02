import { Odyc3Page } from './app.po';

describe('odyc3 App', function() {
  let page: Odyc3Page;

  beforeEach(() => {
    page = new Odyc3Page();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('odyc3 works!');
  });
});
