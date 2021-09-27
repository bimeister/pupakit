import { PuppeteerSetupVariables } from '../declarations/interfaces/puppeteer-setup-variables.interface';

export function getPuppeteerSetupVariables(): PuppeteerSetupVariables {
  const SCREEN_SHOTS_PATH: string = 'e2e/screenshots';

  const cwd: string = process.cwd();
  const BASE_STATIC_DEMO_URL: string = `file://${cwd}`;
  const BASE_URL_CI: string = `${BASE_STATIC_DEMO_URL}/dist/demo/index.html`;
  const BASE_URL: string = `${BASE_URL_CI}#`;
  const BASE_KIT_URL: string = `${BASE_URL}/kit`;

  return {
    timeOutMs: 30000,
    screenshotsPath: SCREEN_SHOTS_PATH,
    slowMo: 0,
    launchBrowserArguments: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ],
    ignoreDefaultArguments: ['--disable-extensions'],
    baseUrlCI: BASE_URL_CI,
    baseUrl: BASE_URL,
    baseKitUrl: BASE_KIT_URL
  };
}
