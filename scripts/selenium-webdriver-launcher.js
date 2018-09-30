/* global process, require */

'use strict';

const webdriver = require('selenium-webdriver');

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger()
  .setLevel(webdriver.logging.Level.ALL);

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .usingServer('http://localhost:4444/wd/hub')
  .build();

const serverUrl = process.argv[2];

driver.get(serverUrl);

process.on('SIGTERM', () => {
  driver.quit().then(() => {
    process.exit();
  }
});

  process.stdin.resume();
