export interface PuppeteerSetupVariables {
  timeOutMs: number;
  screenshotsPath: string;
  slowMo: number;
  launchBrowserArguments: string[];
  ignoreDefaultArguments: string[];
  baseUrlCI: string;
  baseUrl: string;
}
