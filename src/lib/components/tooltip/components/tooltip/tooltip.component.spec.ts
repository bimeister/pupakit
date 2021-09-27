import { PuppeteerSetupVariables } from '../../../../../internal/declarations/interfaces/puppeteer-setup-variables.interface';
import { getPuppeteerSetupVariables } from '../../../../../internal/helpers/get-puppeteer-setup-variables.helper';
import { BoundingBox, Browser, ElementHandle, launch, Page, Viewport } from 'puppeteer';
import { from, Observable, of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { VOID } from '../../../../../internal/constants/void.const';
import { mapToVoid } from '@bimeister/utilities';

const {
  timeOutMs: TIME_OUT_MS,
  slowMo: SLOW_MO,
  screenshotsPath: SCREEN_SHOTS_PATH,
  launchBrowserArguments: LAUNCH_BROWSER_ARGUMENTS,
  ignoreDefaultArguments: IGNORE_DEFAULT_ARGUMENTS,
  baseUrl: BASE_URL
}: PuppeteerSetupVariables = getPuppeteerSetupVariables();

const BASE_KIT_URL: string = `${BASE_URL}/kit`;

const SCREEN_SHOT_PATH: string = `${SCREEN_SHOTS_PATH}/tooltip.screenshot.png`;
const VIEWPORT: Viewport = { width: 1920, height: 1080 };

describe('tooltip.component.ts', () => {
  let page: Page;
  let browser: Browser;

  let setTooltipDisabledState: (isDisabled: boolean) => Observable<void>;
  let setTooltipHideOnTooltipHoverState: (hideOnTooltipHoverState: boolean) => Observable<void>;

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
        switchMap(() => from(page.goto(`${BASE_KIT_URL}/tooltip`, { waitUntil: 'domcontentloaded' })))
      )
      .subscribe(() => {
        setTooltipDisabledState = (isDisabled: boolean) =>
          from(page.waitForSelector('.tooltip-demo__disabled-checkbox input')).pipe(
            switchMap((elementHandle: ElementHandle<HTMLElement>) =>
              from(
                page.evaluate(
                  () => document.querySelector<HTMLInputElement>('.tooltip-demo__disabled-checkbox input').checked
                )
              ).pipe(
                switchMap((isChecked: boolean) => (isDisabled === isChecked ? of(VOID) : from(elementHandle.click())))
              )
            ),
            mapToVoid()
          );

        setTooltipHideOnTooltipHoverState = (hideOnTooltipHoverState: boolean) =>
          from(page.waitForSelector('.tooltip-demo__hide-on-tooltip-hover-checkbox input')).pipe(
            switchMap((elementHandle: ElementHandle<HTMLElement>) =>
              from(
                page.evaluate(
                  () =>
                    document.querySelector<HTMLInputElement>('.tooltip-demo__hide-on-tooltip-hover-checkbox input')
                      .checked
                )
              ).pipe(
                switchMap((isChecked: boolean) =>
                  hideOnTooltipHoverState === isChecked ? of(VOID) : from(elementHandle.click())
                )
              )
            ),
            mapToVoid()
          );

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
          expect(result).toEqual('Tooltip');
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'tooltip width should be less or equal 126rem and height should be less or equal 64rem with large text',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => from(page.waitForSelector('pupa-tooltip-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.waitForSelector('.tooltip'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.boundingBox()))
        )
        .subscribe((boundingBox: BoundingBox) => {
          expect(boundingBox.width).toBeLessThanOrEqual(126 * 4);
          expect(boundingBox.height).toBeLessThanOrEqual(64 * 4);
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'tooltip should be hidden on tooltip hover if hideOnTooltipHover is true',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => setTooltipHideOnTooltipHoverState(true)),
          switchMap(() => from(page.waitForSelector('pupa-tooltip-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.waitForSelector('.tooltip'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.$('.tooltip')))
        )
        .subscribe((elementHandle: ElementHandle<HTMLElement>) => {
          expect(elementHandle).toBeNull();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'tooltip should not be hidden on tooltip hover if hideOnTooltipHover is false',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => setTooltipHideOnTooltipHoverState(false)),
          switchMap(() => from(page.waitForSelector('pupa-tooltip-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.waitForSelector('.tooltip'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.$('.tooltip')))
        )
        .subscribe((elementHandle: ElementHandle<HTMLElement>) => {
          expect(elementHandle).not.toBeNull();
          done();
        });
    },
    TIME_OUT_MS
  );

  it(
    'tooltip should not be shown on trigger hover if disabled is true',
    (done: jest.DoneCallback) => {
      of(VOID)
        .pipe(
          switchMap(() => setTooltipDisabledState(true)),
          switchMap(() => from(page.waitForSelector('pupa-tooltip-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.$('.tooltip')))
        )
        .subscribe((elementHandle: ElementHandle<HTMLElement>) => {
          expect(elementHandle).toBeNull();
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
          switchMap(() => setTooltipDisabledState(false)),
          switchMap(() => from(page.waitForSelector('pupa-tooltip-trigger'))),
          switchMap((elementHandle: ElementHandle<HTMLElement>) => from(elementHandle.hover())),
          switchMap(() => from(page.waitForSelector('.tooltip'))),
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
