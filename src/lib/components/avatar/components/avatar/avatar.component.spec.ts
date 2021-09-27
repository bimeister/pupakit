import { mapToVoid } from '@bimeister/utilities';
import { BoundingBox, Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, Observable } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { PuppeteerSetupVariables } from '../../../../../internal/declarations/interfaces/puppeteer-setup-variables.interface';
import { getPuppeteerSetupVariables } from '../../../../../internal/helpers/get-puppeteer-setup-variables.helper';

const {
  timeOutMs: TIME_OUT_MS,
  screenshotsPath: SCREEN_SHOTS_PATH,
  slowMo: SLOW_MO,
  launchBrowserArguments: LAUNCH_BROWSER_ARGUMENTS,
  ignoreDefaultArguments: IGNORE_DEFAULT_ARGUMENTS,
  baseUrlCI: BASE_URL_CI,
  baseUrl: BASE_URL
}: PuppeteerSetupVariables = getPuppeteerSetupVariables();

const BASE_KIT_URL: string = `${BASE_URL}/kit`;

const SCREEN_SHOT_PATH: string = `${SCREEN_SHOTS_PATH}/avatar.screenshot.png`;
const VIEWPORT: Viewport = { width: 1920, height: 1080 };

describe('avatar.component.ts', () => {
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
        switchMap(() => from(page.goto(`${BASE_KIT_URL}/avatar`, { waitUntil: 'domcontentloaded' })))
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
    'page header h1 should be Avatar',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('h1'))
        .pipe(switchMap(() => from(page.evaluate(() => document.querySelector('h1').textContent))))
        .subscribe((result: string) => {
          expect(result).toEqual('Avatar');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'avatar size should 16px when small',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('input[value="small"]'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('pupa-avatar'))),
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.boundingBox()))
        )
        .subscribe(({ width, height }: BoundingBox) => {
          expect(width).toEqual(16);
          expect(height).toEqual(16);
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'avatar size should 24px when medium',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('input[value="medium"]'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('pupa-avatar'))),
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.boundingBox()))
        )
        .subscribe(({ width, height }: BoundingBox) => {
          expect(width).toEqual(24);
          expect(height).toEqual(24);
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'should click on set avatar button and check that avatar background image, after that clear input',
    (done: jest.DoneCallback) => {
      from(page.waitForSelector('pupa-button'))
        .pipe(
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('pupa-avatar'))),
          switchMap(() =>
            from(
              page.evaluate(() =>
                window.getComputedStyle(document.querySelector('.avatar')).getPropertyValue('background-image')
              )
            )
          ),
          tap((resultBackGroundImage: string) => expect(resultBackGroundImage).not.toEqual('url("")')),
          switchMap(() => from(page.waitForSelector('.clear-image'))),
          switchMap((elementHandle: ElementHandle<Element>) => from(elementHandle.click())),
          switchMap(() => from(page.waitForSelector('pupa-avatar'))),
          switchMap(() =>
            from(
              page.evaluate(() =>
                window.getComputedStyle(document.querySelector('.avatar')).getPropertyValue('background-image')
              )
            )
          )
        )
        .subscribe((resultBackGroundImage: string) => {
          expect(resultBackGroundImage).toEqual(`url("${BASE_URL_CI}")`);
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
