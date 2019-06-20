import { browser, logging } from 'protractor';

import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Welcome to sample-project!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const loggingEntryObject: logging.Entry = {
      level: logging.Level.SEVERE
    } as any;
    const logs: logging.Entry[] = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining(loggingEntryObject));
  });
});
