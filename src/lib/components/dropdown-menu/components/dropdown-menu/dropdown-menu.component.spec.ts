import { Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { VOID } from '../../../../../internal/constants/void.const';
import { PuppeteerSetupVariables } from '../../../../../internal/declarations/interfaces/puppeteer-setup-variables.interface';
import { getPuppeteerSetupVariables } from '../../../../../internal/helpers/get-puppeteer-setup-variables.helper';

const {
  timeOutMs: TIME_OUT_MS,
  slowMo: SLOW_MO,
  screenshotsPath: SCREEN_SHOTS_PATH,
  launchBrowserArguments: LAUNCH_BROWSER_ARGUMENTS,
  ignoreDefaultArguments: IGNORE_DEFAULT_ARGUMENTS,
  baseKitUrl: BASE_KIT_URL
}: PuppeteerSetupVariables = getPuppeteerSetupVariables();
const SCREEN_SHOT_PATH: string = `${SCREEN_SHOTS_PATH}/dropdown-menu.screenshot.png`;
const VIEWPORT: Viewport = { width: 1920, height: 1080 };

describe('dropdown-menu.component.ts', () => {
  let page: Page;
  let browser: Browser;

  beforeAll((done: jest.DoneCallback) => {
    from(
      launch({
        headless: true,
        defaultViewport: VIEWPORT,
        slowMo: SLOW_MO,
        args: LAUNCH_BROWSER_ARGUMENTS,
        ignoreDefaultArgs: IGNORE_DEFAULT_ARGUMENTS
      })
    )
      .pipe(
        tap((responseBrowser: Browser) => (browser = responseBrowser)),
        switchMap((responseBrowser: Browser) => from(responseBrowser.newPage())),
        tap((responsePage: Page) => (page = responsePage)),
        switchMap((responsePage: Page) => from(responsePage.setViewport(VIEWPORT)).pipe(mapTo(responsePage))),
        switchMap((responsePage: Page) => from(responsePage.goto(BASE_KIT_URL, { waitUntil: 'domcontentloaded' }))),
        switchMap(() => from(page.goto(`${BASE_KIT_URL}/dropdown-menu`, { waitUntil: 'domcontentloaded' })))
      )
      .subscribe(() => {
        done();
      });
  });

  it(
    'should render page title as PupaKit',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(switchMap(() => from(page.title())))
        .subscribe((resultTitle: string) => {
          expect(resultTitle).toEqual('PupaKit');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'page header h1 should be Tooltip',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => from(page.waitForSelector('h1'))),
          switchMap(() => from(page.evaluate(() => document.querySelector('h1').textContent)))
        )
        .subscribe((result: string) => {
          expect(result).toEqual('Dropdown menu');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'dropdown should open',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => from(page.waitForSelector('.dropdown-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('.dropdown-content__menu')))
        )
        .subscribe((elementHandle: ElementHandle<HTMLElement>) => {
          expect(elementHandle).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should take full page screenshot',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => from(page.waitForSelector('.dropdown-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('.dropdown-content__menu'))),
          switchMap(() => from(page.screenshot({ path: SCREEN_SHOT_PATH, type: 'png', fullPage: true })))
        )
        .subscribe(() => {
          done();
        });
    },
    TIME_OUT_MS
  );

  afterAll((done: jest.DoneCallback) => {
    from(page.close())
      .pipe(switchMap(() => from(browser.close())))
      .subscribe(() => done());
  });
});
