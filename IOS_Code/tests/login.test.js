//Setup webdriver
const wdio = require("webdriverio");
jest.setTimeout(20000);

//Declare Global Variables
let CORRECT_EMAIL;
let CORRECT_PASS;
let client;
let LOADING;
let EMAIL_TXT_FIELD;
let PASSWORD_TXT_FIELD;
let LOGIN_BTN;
let POPUP;
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

//This function waits until there is no longer a loading screen
async function FacebookPage(){
    await client.$(URL_BAR).click();
    await client.$(URL_BAR).setValue('facebook.com' + "\n");

    const confirmed = await client.$(FACEBOOK).isDisplayed();
};

//This runs before any of the tests run
beforeAll(()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL = 'melnik1jg@alma.edu';
    CORRECT_PASS = 'MNFtQ:X4AucpNiz';

    //Accessibility ID
    URL_BAR = '~URL';
    LOGIN_BTN = 'Log In';

    //ElementID
    EMAIL_TXT_FIELD = '58000000-0000-0000-1048-000000000000';
    PASSWORD_TXT_FIELD = '58000000-0000-0000-1048-000000000000';

    //Xpath
    LOADING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ProgressBar';
    POPUP = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.TextView';
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

//This tests if the Login was successful
test('Successfull Login', async() =>{
    //Declare Values
    const NOT_NOW_BTN = '~Not Now';
    const SKIP_BTN = '~Skip';
    const SKIP_BTN2 = 'B4040000-0000-0000-1048-000000000000';
    const PROFILE = '~Profile';

    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS);
    await client.$(LOGIN_BTN).click();

    await client.$(NOT_NOW_BTN).click();
    await client.$(SKIP_BTN).click();
    await client.$(SKIP_BTN2).click();

    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});
