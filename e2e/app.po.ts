export class Odyc3Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('odyc3-app h1')).getText();
  }
}
