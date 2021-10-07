import { mapToVoid } from '@bimeister/utilities';
import { BoundingBox, Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, Observable } from 'rxjs';
import { delay, mapTo, switchMap, tap } from 'rxjs/operators';
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
const SCREEN_SHOT_PATH: string = `${SCREEN_SHOTS_PATH}/checkbox.screenshot.png`;
const VIEWPORT: Viewport = { width: 1920, height: 1080 };

describe('checkbox.component.ts', () => {
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
        switchMap(() => from(page.goto(`${BASE_KIT_URL}/checkbox`, { waitUntil: 'domcontentloaded' })))
      )
      .subscribe(() => {
        done();
      });
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
    'should display page`s header as checkbox',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('h1'))
        .pipe(switchMap(() => from(page.evaluate(() => document.querySelector('h1').textContent))))
        .subscribe((result: string) => {
          expect(result).toEqual('Checkbox');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should render checkmark component with height and width equal to 16px + 4px and 16px accordingly',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('pupa-checkbox-mark'))
        .pipe(switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.boundingBox())))
        .subscribe((boundingBox: BoundingBox) => {
          expect(boundingBox.width).toBe(16);
          expect(boundingBox.height).toBe(16 + 4);
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should click on checkbox and switch checkbox marker',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('pupa-checkbox-mark'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() =>
            from(page.evaluate(() => document.querySelector('.checkbox').classList.contains('checkbox_with-marker')))
          )
        )
        .subscribe((isActive: boolean) => {
          expect(isActive).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should click on label element and switch checkbox marker',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('pupa-tooltip'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() =>
            from(page.evaluate(() => document.querySelector('.checkbox').classList.contains('checkbox_with-marker')))
          )
        )
        .subscribe((isActive: boolean) => {
          expect(isActive).toBeFalsy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should click on indeterminate option and rerender checkbox marker',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.indeterminate-props input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          delay(500),
          switchMap(() =>
            from(page.evaluate(() => document.querySelector('.checkbox').classList.contains('checkbox_indeterminate')))
          )
        )
        .subscribe((isActive: boolean) => {
          expect(isActive).toBeTruthy();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should click on disabled option and rerender checkbox marker',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('.disabled-props input'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          delay(500),
          switchMap(() =>
            from(page.evaluate(() => document.querySelector('.checkbox').classList.contains('checkbox_disabled')))
          )
        )
        .subscribe((isActive: boolean) => {
          expect(isActive).toBeTruthy();
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
