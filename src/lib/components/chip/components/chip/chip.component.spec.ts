import { mapToVoid } from '@bimeister/utilities';
import { Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, Observable } from 'rxjs';
import { delay, mapTo, switchMap, tap } from 'rxjs/operators';
import { PuppeteerSetupVariables } from '../../../../../internal/declarations/interfaces/puppeteer-setup-variables.interface';
import { getPuppeteerSetupVariables } from '../../../../../internal/helpers/get-puppeteer-setup-variables.helper';

const {
  timeOutMs: TIME_OUT_MS,
  screenshotsPath: SCREEN_SHOTS_PATH,
  slowMo: SLOW_MO,
  launchBrowserArguments: LAUNCH_BROWSER_ARGUMENTS,
  ignoreDefaultArguments: IGNORE_DEFAULT_ARGUMENTS,
  baseKitUrl: BASE_KIT_URL,
}: PuppeteerSetupVariables = getPuppeteerSetupVariables();
const SCREEN_SHOT_PATH: string = `${SCREEN_SHOTS_PATH}/chip.screenshot.png`;
const VIEWPORT: Viewport = { width: 1920, height: 1080 };

describe('chip.component.ts', () => {
  let page: Page;
  let browser: Browser;

  beforeAll((done: jest.DoneCallback) => {
    from(
      launch({
        headless: true,
        defaultViewport: VIEWPORT,
        slowMo: SLOW_MO,
        args: LAUNCH_BROWSER_ARGUMENTS,
        ignoreDefaultArgs: IGNORE_DEFAULT_ARGUMENTS,
      })
    )
      .pipe(
        tap((responseBrowser: Browser) => (browser = responseBrowser)),
        switchMap((responseBrowser: Browser) => from(responseBrowser.newPage())),
        tap((responsePage: Page) => (page = responsePage)),
        switchMap((responsePage: Page) => from(responsePage.setViewport(VIEWPORT)).pipe(mapTo(responsePage))),
        switchMap((responsePage: Page) => from(responsePage.goto(BASE_KIT_URL, { waitUntil: 'domcontentloaded' }))),
        switchMap(() => from(page.goto(`${BASE_KIT_URL}/chip`, { waitUntil: 'domcontentloaded' })))
      )
      .subscribe(() => done());
  }, TIME_OUT_MS);

  it(
    'should render page title as PupaKit',
    (done: jest.DoneCallback) => {
      from(page.title()).subscribe((resultTitle: string) => {
        expect(resultTitle).toEqual('PupaKit');
        done();
      });
    },
    TIME_OUT_MS
  );

  it(
    'should take full page screenshot',
    (done: jest.DoneCallback) => {
      const screenshot$: Observable<void> = from(
        page.screenshot({ path: SCREEN_SHOT_PATH, type: 'png', fullPage: true })
      ).pipe(mapToVoid());
      screenshot$.subscribe(() => done());
    },
    TIME_OUT_MS
  );

  it(
    'page header h1 should be Chip',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('h1'))
        .pipe(switchMap(() => from(page.evaluate(() => document.querySelector('h1').textContent))))
        .subscribe((result: string) => {
          expect(result).toEqual('Chip');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip-color is primary',
    (done: jest.DoneCallback) => {
      from(page.waitForXPath('//pupa-radio-control[contains(., "primary")]'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.evaluate(() => document.querySelector('.chip').classList.contains('chip_primary'))))
        )
        .subscribe((isPrimary: boolean) => {
          expect(isPrimary).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip-color is light',
    (done: jest.DoneCallback) => {
      from(page.waitForXPath('//pupa-radio-control[contains(., "light")]'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.evaluate(() => document.querySelector('.chip').classList.contains('chip_light'))))
        )
        .subscribe((isLight: boolean) => {
          expect(isLight).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip-color is error',
    (done: jest.DoneCallback) => {
      from(page.waitForXPath('//pupa-radio-control[contains(., "error")]'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.evaluate(() => document.querySelector('.chip').classList.contains('chip_error'))))
        )
        .subscribe((isLight: boolean) => {
          expect(isLight).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip is disabled',
    (done: jest.DoneCallback) => {
      from(page.waitForXPath('//demo-example-viewer-property[@name="isDisabled"]//demo-props-switcher'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          delay(0),
          switchMap(() =>
            from(page.evaluate(() => document.querySelector('.chip').classList.contains('chip_disabled')))
          )
        )
        .subscribe((isDisabled: boolean) => {
          expect(isDisabled).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  afterAll((done: jest.DoneCallback) => {
    from(page.close())
      .pipe(switchMap(() => from(browser.close())))
      .subscribe(() => done());
  }, TIME_OUT_MS);
});
