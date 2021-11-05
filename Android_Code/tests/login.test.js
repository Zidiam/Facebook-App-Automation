//login.test.js

//Setup webdriver
const wdio = require("webdriverio");
jest.setTimeout(200000);

//Declare Global Variables
let CORRECT_EMAIL;
let CORRECT_PASS;
let client;
let LOADING;
let EMAIL_TXT_FIELD;
let PASSWORD_TXT_FIELD;
let LOGIN_BTN;
let POPUP;

//This code is specific to appium to connect to device
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

//This function waits until there is no longer a loading screen
async function Loading(){
    while(await client.$(LOADING).isDisplayed()){
        await client.pause(1000);
    };
}

//This runs before any of the tests run
beforeAll(()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL = 'melnik1jg@alma.edu';
    CORRECT_PASS = 'MNFtQ:X4AucpNiz';

    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Xpath
    LOADING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ProgressBar';
    POPUP = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.TextView';
});

//This runs before each test
beforeEach( async() => {
    client = await wdio.remote(opts);
});

//This runs after each test
afterEach( async() => {
    await client.deleteSession();
});

//This checks if the connection was successful
test('Connected', async() =>{
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

//This tests if the Login was successful
test('Successfull Login', async() =>{
    //declare element selector values
    const SKIP = '~Skip';
    const PROFILE = '~Go to profile';

    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS);
    await client.$(LOGIN_BTN).click();

    await Loading();

    //New users have a skip popup
    if(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        await Loading();
    };

    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});

//This tests if the login feature failed
test('Login Failed', async() =>{
    //declare element selector values
    await client.$(EMAIL_TXT_FIELD).setValue('fakemail@gmail.com');
    await client.$(PASSWORD_TXT_FIELD).setValue('fakepass');
    await client.$(LOGIN_BTN).click();

    await Loading();

    const confirmed = await client.$(POPUP).getText();
    expect(confirmed).toBe('Login Failed');
});

//This tests if your password was entered incorrectly
test('Incorrect Password', async() =>{
    //declare element selector values
    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue('Not Password');
    await client.$(LOGIN_BTN).click();

    await Loading();

    const confirmed = await client.$(POPUP).getText();
    expect(confirmed).toBe('Incorrect Password');
});

//This tests if Facebook has the email entered in their database
test('No Account Found', async() =>{
    //declare element selector values
    await client.$(EMAIL_TXT_FIELD).setValue('fakemailtester333@gmail.com');
    await client.$(PASSWORD_TXT_FIELD).setValue('fakepassword333!');
    await client.$(LOGIN_BTN).click();

    await Loading();

    const confirmed = await client.$(POPUP).getText();
    expect(confirmed).toBe('Need help finding your account?');
});