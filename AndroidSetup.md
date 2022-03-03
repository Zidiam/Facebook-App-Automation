# Android Tutorial:

This code will test Facebooks apps features on Android on Windows OS. This will use Jest for the testing. Appium and WebDriverIO is for automating the tasks.

## Required Downloads

[Java SDK](https://www.oracle.com/java/technologies/downloads/)

[Android Studio](https://developer.android.com/studio)

[Node.js](https://nodejs.org/en/download/)

[Appium](https://github.com/appium/appium-desktop/releases)

[Appium Inspector](https://github.com/appium/appium-inspector/releases)

[Visual Studio Code](https://code.visualstudio.com/download)

## Setup Enviromental Variables
#### Windows
[ANDROID_HOME](http://www.automationtestinghub.com/setup-android-environment-variables/)

[JAVA_HOME](https://confluence.atlassian.com/doc/setting-the-java_home-variable-in-windows-8895.html)

#### MAC
[ANDROID_HOME](https://www.panayiotisgeorgiou.net/setting-android-home-enviromental-variable-on-macosx/)

[JAVA_HOME](https://mkyong.com/java/how-to-set-java_home-environment-variable-on-mac-os-x/)

## Create Emulated Device
Open Android Studio and click 'More Actions'. Click on 'AVD Manager' in the drop down menu. Then click '+Create Virtual Device' and select Pixel 2. Click 'Next' then click 'Download' next to the R for 'Release Name'. After installation click 'Next' and finally click 'Finish'.
### How to run the emulator
Open 'AVD Manager' and click the green play button under 'Actions'.

## Creating Project
Create a new folder called 'Facebook-App-Automation'

Then through a terminal cd into the 'Facebook-App-Automation' directory.

In the terminal input the following one after another:

```bash
npm init -y
npm install webdriverio
npm i jest
```

Then type ``` code .``` to open 'Facebook-App-Automation' project in Visual Studio Code, or just open the directory using Visual Studio Code.

## Setup Files
Open package.json and change "test" value to "jest"

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
## package.json
Change the package.json from to
```bash
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ```
to this
```bash
"scripts": {
    "test": "jest"
  },
```

## Getting Facebooks API information
Run Android Emulator

In the emulator download Facebook from the 'Play Store'

Open a Terminal by simply type 'cmd' in your windows search bar on the bottom left.

Run ```adb devices``` in the Terminal, this will display your devices name. The emulator name should look something like emulator-5554.

On your emulator make sure you can see your Facebook app. Before entering the App run ```adb -s emulatorname logcat > logcatfile.txt ``` in the Terminal. Then open Facebook app and then in Terminal press Control+C to terminate.

Now open logcatfile.txt file in your directory as a text document. Press Control+F to search for the text `cmp=com.facebook.katana/.LoginActivity`. This text is specific to Facebook and you have to find this anytime you want to automate an app just search for `cmp=` to find this. The text 'com.facebook.katana' will be for appPackage and the '.LoginActivity' will be for appActivity in Appium.

## Appium
Open Appium Server GUI and Appium Inspector

In Appium GUI click 'Start Server' the default values should be Host: 0.0.0.0 and Port: 4723

In Appium Inspector input `/wd/hub` into Remote Path

### Input in the Desired Capabilities Tab:

After each input click the "+" button to add another input line

Name: `platformName` Value: `Android`

Name: `automationName` Value: `UiAutomator2`

Name: `udid` Value: `emulator-5554`

Name: `appPackage` Value: `com.facebook.katana`

Name: `appActivity` Value: `.LoginActivity`

Your JSON Representation should look like:

```bash
{
  "platformName": "Android",
  "automationName": "UiAutomator2",
  "udid": "emulator-5554",
  "appPackage": "com.facebook.katana",
  "appActivity": ".LoginActivity"
}
```

Then checkmark the 'Automatically add necessary Appium vendor prefixes on start'

Click 'Save As...' and name it 'facebookapi'

Then click 'Start Session' This should open the Facebook app on the emulator.

## Appium Inspector

Now that you have the Facebook app on your Appium Inspector you can find elements and test those elements.

On the top hotbar click the refresh button to make sure you are seeing the samething on your inspector and emulator

### Getting 'accessibility id' elements

In Appium Inspector

Click on the 'Phone or email' input

On the right you will 'Selected Element'. In this you will see two tabs with 'Find By' and 'Selector'. In the 'Find By' tab you will see 'accessibility id
' with the 'Selector' being 'Username'. 'Username' is important for when we start coding. Now do the same for 'Password' and the 'Login In' button and get their 'accessibility id'. 

You should now have three values 'Username', 'Password', 'Log In'

### Using the Inspector
You can use the Facebook app on the emulator to get to a desired page. To view the desired page on the Appium Inspector you can click the refresh button on the top. This will now let you find elements you need to find which we will use later on.

Example:

Using Facebook app to login to an account. Then refreshing on the Inspector to get the `Skip` element id. Then clicking the `Skip` on the Facebook App to get to the login page. Refresh on the Inspector again to get the `Go to profile` element id so we can confirm the login.

## Creating Test

Read [Understanding Login Test](##-Understanding-login.test.js) to understand what's happening.=

```bash
//login.test.js

const wdio = require("webdriverio");
jest.setTimeout(20000);

let client;

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        automationName: "UiAutomator2",
        udid: "emulator-5554",
        appPackage: "com.facebook.katana",
        appActivity: ".LoginActivity"
    }
};

afterAll( async() => {
    await client.deleteSession();
});

test('Connected', async() =>{
    client = await wdio.remote(opts);
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

test('Logging In', async() =>{
    //declare element selector values
    const EMAIL_TXT_FIELD = '~Username'
    const PASSWORD_TXT_FIELD = '~Password'
    const LOGIN_BTN = '~Log In'
    const SKIP = '~Skip'
    const PROFILE = '~Go to profile'
    
    await client.$(EMAIL_TXT_FIELD).setValue('email');
    await client.$(PASSWORD_TXT_FIELD).setValue('pass');
    await client.$(LOGIN_BTN).click();
    await client.pause(6000);
    if(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        await client.pause(1000);
    }
    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});

}
```

## Running Test
Open a terminal through Visual Studio Code by clicking 'Terminal' tab on the top.

Type `npm run test`

You should get

```bash
 PASS  tests/login.test.js (24.879 s)
  √ Connected (10017 ms)
  √ Logging In (13625 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Understanding login.test.js

The code below is the JSON representation we got from our saved capability 'facebookapi'. This code connects the test to the facebookapi.

```bash
const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        automationName: "UiAutomator2",
        udid: "emulator-5554",
        appPackage: "com.facebook.katana",
        appActivity: ".LoginActivity"
    }
};
```
The code below safely closes the test and application on the emulator.

```bash
afterAll( async() => {
    await client.deleteSession();
});
```

The code below tests if the connection to the api was successful. This test is important to pass since if this does not pass then the next test will Fail since a connection to the api is important. The expect value is just checking if the client Object has the value 'com.facebook.katana' which proves the connection was established. 

```bash
test('Connected', async() =>{
    client = await wdio.remote(opts);
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});
```

The code below tests if the login was successfull

```bash
test('Logging In', async() =>{
    //declare element selector values
    const EMAIL_TXT_FIELD = '~Username'
    const PASSWORD_TXT_FIELD = '~Password'
    const LOGIN_BTN = '~Log In'
    const SKIP = '~Skip'
    const PROFILE = '~Go to profile'
    
    await client.$(EMAIL_TXT_FIELD).setValue('email');
    await client.$(PASSWORD_TXT_FIELD).setValue('pass');
    await client.$(LOGIN_BTN).click();
    await client.pause(6000);
    if(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        await client.pause(1000);
    }
    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});
```

This code should look familiar. The constants are the values we found before when using Appium Inspector to find the [accessibility id](###-Getting-'accessibility-id'-elements)

```bash
//declare element selector values
const EMAIL_TXT_FIELD = '~Username'
const PASSWORD_TXT_FIELD = '~Password'
const LOGIN_BTN = '~Log In'
const SKIP = '~Skip'
const PROFILE = '~Go to profile'
```

This code sets the elements input

```bash
await client.$(EMAIL_TXT_FIELD).setValue('email');
await client.$(PASSWORD_TXT_FIELD).setValue('pass');
```

This code clicks the element

```bash
await client.$(LOGIN_BTN).click();
```

This code makes the client wait for 6 seconds(So the login loads)

```bash
await client.pause(6000);
```

This code just checks if there is a 'Skip' button that shows up for new users and if there is to just click it to continue.

```bash
if(await client.$(SKIP).isDisplayed()){
    await client.$(SKIP).click();
    await client.pause(1000);
}
```

This code is finally the Jest Test to see if the login is successful by testing if the profile element is displayed. If its displayed then the facebook login was successful.

```bash
const confirmed = await client.$(PROFILE).isDisplayed();
expect(confirmed).toBe(true);
```

### Side Note

We use Async and Await so we can wait for a promise to fullfill learn more at [Jest/AsyncandAwait](https://jestjs.io/docs/tutorial-async#asyncawait)
