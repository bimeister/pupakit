import { mapToVoid } from '@bimeister/utilities';
import { Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, Observable, of, race } from 'rxjs';
import { delay, mapTo, switchMap, tap } from 'rxjs/operators';
import { PuppeteerSetupVariables } from '../../../../../internal/declarations/interfaces/puppeteer-setup-variables.interface';
import { getPuppeteerSetupVariables } from '../../../../../internal/helpers/get-puppeteer-setup-variables.helper';

const {
  timeOutMs: TIME_OUT_MS,
  screenshotsPath: SCREEN_SHOTS_PATH,
  slowMo: SLOW_MO,
  launchBrowserArguments: LAUNCH_BROWSER_ARGUMENTS,
  ignoreDefaultArguments: IGNORE_DEFAULT_ARGUMENTS,
  baseUrl: BASE_URL
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
        ignoreDefaultArgs: IGNORE_DEFAULT_ARGUMENTS
      })
    )
      .pipe(
        tap((responseBrowser: Browser) => (browser = responseBrowser)),
        switchMap((responseBrowser: Browser) => from(responseBrowser.newPage())),
        tap((responsePage: Page) => (page = responsePage)),
        switchMap((responsePage: Page) => from(responsePage.setViewport(VIEWPORT)).pipe(mapTo(responsePage))),
        switchMap((responsePage: Page) => from(responsePage.goto(BASE_URL, { waitUntil: 'domcontentloaded' }))),
        switchMap(() => from(page.goto(`${BASE_URL}/chip`, { waitUntil: 'domcontentloaded' })))
      )
      .subscribe(() => done());
  });

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
      from(page.waitForSelector('input[value="primary"]'))
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
      from(page.waitForSelector('input[value="light"]'))
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
    'should check chip has icon',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.icon-checkbox input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() =>
            race(from(page.waitForSelector('.chip-content__icon')).pipe(mapTo(true)), of(false).pipe(delay(4000)))
          )
        )
        .subscribe((hasIcon: boolean) => {
          expect(hasIcon).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip has avatar',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.avatar-checkbox input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() =>
            race(from(page.waitForSelector('.chip-content__avatar')).pipe(mapTo(true)), of(false).pipe(delay(4000)))
          )
        )
        .subscribe((hasAvatar: boolean) => {
          expect(hasAvatar).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip has delete-button',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.with-delete-button-checkbox input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() =>
            race(
              from(page.waitForSelector('.chip-content__delete-button')).pipe(mapTo(true)),
              of(false).pipe(delay(4000))
            )
          )
        )
        .subscribe((havAvatar: boolean) => {
          expect(havAvatar).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should check chip is disabled',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.disabled-checkbox input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
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
  });
});
