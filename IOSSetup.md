# IOS Tutorial:

This code will test Facebooks app features on IOS. This will use Jest for the testing. Appium and WebDriverIO is for automating the tasks.

## Windows
This tutorial can only work on MAC OS so you will need to do this [tutorial](https://techschumz.com/install-macos-monterey-on-virtualbox-on-windows-10/) to run a virtual mac on your windows machine. The rest of the tutorial will be done on the mac machine.

## Required Downloads

[Node.js](https://nodejs.org/en/download/)

[Xcode](https://developer.apple.com/xcode/)

[Homebrew](https://brew.sh/)

[Appium](https://github.com/appium/appium-desktop/releases)

[Appium Inspector](https://github.com/appium/appium-inspector/releases)

[Visual Studio Code](https://code.visualstudio.com/download)

## Download Simulator
Open Xcode and install all tools and go through installation.

On the top bar click Xcode and in the dropdown press Preferences.

Then press components and download the latest simulator.

## Terminal Commands
```bash
xcode-select --install
brew install carthage
mkdir Facebook-App-Automation
cd Facebook-App-Automation
npm init -y
npm install webdriverio
npm i jest
code .
```

## Setup Files
Open Facebook-App-Automation directory in VSCode

Open package.json and change ``` "test": "echo \"Error: no test specified\" && exit 1" ``` to ``` "test": "jest" ```

Create a folder named `tests`

Inside the `tests` folder create a file named login.test.js

Directory should look like this:
```bash
-node_modules
-tests
    -login.test.js
-package-lock.json
-package.json
```
## Appium
Open Appium Server GUI and Appium Inspector

In Appium GUI click 'Start Server' the default values should be Host: 0.0.0.0 and Port: 4723

In Appium Inspector input `/wd/hub` into Remote Path

### Input in the Desired Capabilities Tab:

After each input click the "+" button to add another input line

Name: `platformName` Value: `iOS`

Name: `deviceName` Value: `iPhone 12 Pro Max`

Name: `automationName` Value: `XCUITest`

Name: `platformVersion` Value: `14.5`

Name: `bundleId` Value: `com.apple.mobilesafari`

Your JSON Representation should look like:

```bash
{
  "platformName": "iOS",
  "deviceName": "iPhone 12 Pro Max",
  "automationName": "XCUITest",
  "platformVersion": "14.5",
  "bundleId": "com.apple.mobilesafari"
}
```

Then checkmark the 'Automatically add necessary Appium vendor prefixes on start'

Click 'Save As...' and name it 'safariAPI'

Then click 'Start Session' This should open the safari on the simulator.

## Appium Inspector

Now that you have the Safari app on your Appium Inspector you can find elements and test those elements.

On the top hotbar click the refresh button to make sure you are seeing the samething on your inspector and emulator

### Getting 'accessibility id' or 'Xpath' elements

In Appium Inspector

Click on the url bar on the top

On the right you will 'Selected Element'. In this you will see two tabs with 'Find By' and 'Selector'. In the 'Find By' tab you will see 'accessibility id
' with the 'Selector' being 'URL'. 'URL' is important for when we start coding. Now type facebook.com and enter. Now do the same for the Facebook Logo which will be under 'Xpath'.

You should now have four values 'URL' and '(//XCUIElementTypeLink[@name="facebook"])[1]'

### Using the Inspector
You can use the Safari app on the emulator to get to a desired page. To view the desired page on the Appium Inspector you can click the refresh button on the top. This will now let you find elements you need to find which we will use later on.

Example:

Using Safari app to go to the Facebook website. Then refreshing on the Inspector to get the ``(//XCUIElementTypeLink[@name="facebook"])[1]`` Xpath on the Facebook site.

## Creating Test

Read [Understanding Login Test](##-Understanding-login.test.js) below to for a deeper explanation of the code.

```bash
//Setup webdriver
const wdio = require("webdriverio");
jest.setTimeout(20000);

//Declare Global Variables
let URL_BAR;
let FACEBOOK;

//This code is specific to appium to connect to device
const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "iOS",
        deviceName: "iPhone 12 Pro Max",
        automationName: "XCUITest",
        platformVersion: "14.3",
        bundleId: "com.apple.mobilesafari"
    }
};

//This runs before any of the tests run
beforeAll(()=>{
    //Accessibility ID
    URL_BAR = '~URL';
    //Xpath
    FACEBOOK = '(//XCUIElementTypeLink[@name="facebook"])[1]';
});

//This runs before each test
beforeEach( async() => {
    client = await wdio.remote(opts);
});

//This runs after each test
afterEach( async() => {
    await client.deleteSession();
});

test('Connected', async()=>{
    expect(Object.values(client)[1]['bundleId']).toBe('com.apple.mobilesafari');
});

//This checks if the connection was successful
test('Connected To Facebooks Website', async() =>{
    //declare element selector values
    await client.$(URL_BAR).click();
    await client.$(URL_BAR).setValue('facebook.com' + "\n");

    const confirmed = await client.$(FACEBOOK).isDisplayed();
    expect(confirmed).toBe(true);
});
```

## Running Test
Open a terminal through Visual Studio Code by clicking 'Terminal' tab on the top.

Type `npm run test`

You should get

```bash
 PASS  tests/login.test.js (24.879 s)
  √ Connected (10017 ms)
  √ Connected To Facebooks Website (13625 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Understanding login.test.js


This code should look familiar. The constants are the values we found before when using Appium Inspector to find the [accessibility id](###-Getting-'accessibility-id'-elements)

```bash
//Declare Global Variables
let URL_BAR;
let FACEBOOK;
//Accessibility ID
URL_BAR = '~URL';
FACEBOOK = '(//XCUIElementTypeLink[@name="facebook"])[1]';
```

The code below is the JSON representation we got from our saved capability 'safariAPI'. This code connects the test to the facebookapi.

```bash
const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "iOS",
        deviceName: "iPhone 12 Pro Max",
        automationName: "XCUITest",
        platformVersion: "14.3",
        bundleId: "com.apple.mobilesafari"
    }
};
```

The code below starts the client before every test

```bash
beforeEach( async() => {
    client = await wdio.remote(opts);
});
```

The code below safely closes each test and application on the emulator.

```bash
afterEach( async() => {
    await client.deleteSession();
});
```

The code below tests if the connection to the api was successful. This test is important to pass since if this does not pass then the next test will Fail since a connection to the api is important. The expect value is just checking if the client Object has the value 'com.facebook.katana' which proves the connection was established. 

```bash
test('Connected', async() =>{
    expect(Object.values(client)[1]['bundleId']).toBe('com.apple.mobilesafari');
});
```

The code below tests if the you have opened Facebook's website

```bash
//This checks if the Facebook website is displayed
test('Connected To Facebooks Website', async() =>{
    //declare element selector values
    await client.$(URL_BAR).click();
    await client.$(URL_BAR).setValue('facebook.com' + "\n");

    const confirmed = await client.$(FACEBOOK).isDisplayed();
    expect(confirmed).toBe(true);
});
```

This code sets the elements input

```bash
await client.$(URL_BAR).setValue('facebook.com' + "\n");
```

This code clicks the element

```bash
await client.$(URL_BAR).click();
```

This code is finally the Jest Test to see if opening Facebook's website on Safari is successful. This is done by testing if the Facebook element is displayed. If its displayed then the test was successful.

```bash
const confirmed = await client.$(FACEBOOK).isDisplayed();
expect(confirmed).toBe(true);
```

### Side Note

We use Async and Await so we can wait for a promise to fullfill learn more at [Jest/AsyncandAwait](https://jestjs.io/docs/tutorial-async#asyncawait)
