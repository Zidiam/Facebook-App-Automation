//login.test.js

//Setup webdriver
const wdio = require("webdriverio");
//For long tests
jest.setTimeout(200000);

//Declare Global Variables
let CORRECT_EMAIL;
let CORRECT_PASS;
let LOADING;
let EMAIL_TXT_FIELD;
let PASSWORD_TXT_FIELD;
let LOGIN_BTN;
let POPUP;
let client;

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
    await client.pause(1000);
    while(await client.$(LOADING).isDisplayed()){
        await client.pause(1000);
    };
}

//This runs before any of the tests run
beforeAll(async()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL = 'lhyqhaz_zamoresen_1639163329@tfbnw.net';
    CORRECT_PASS = 'kkvhre3e2xn';

    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Class Name
    LOADING = 'android.widget.ProgressBar';
    POPUP = 'android.widget.TextView';
});

//This runs before each test
beforeEach( async() => {
    client = await wdio.remote(opts);
    await Loading();
});

//This runs after each test
afterEach( async() => {
    await client.reloadSession();
});

//This runs after all test
afterAll( async() => {
    await client.deleteSession();
});


//This checks if the connection was successful
test('Connected', async() =>{
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

//This tests if the Login was successful
test('Successfull Login', async() =>{
    //Set Variable
    const SKIP = '~Skip';
    const SKIP_CONFIRM = 'text("SKIP").className("android.widget.Button")';
    const NOT_NOW_BTN = 'text("Not Now").className("android.widget.Button")';
    const PROFILE = '~Go to profile';

    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS);
    await client.$(LOGIN_BTN).click();

    await Loading();

    while(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        if(await client.$(`android=${SKIP_CONFIRM}`).isDisplayed()){
            await client.$(`android=${SKIP_CONFIRM}`).click();
            await Loading();
        };
    }

    if(await client.$(`android=${NOT_NOW_BTN}`).isDisplayed()){
        await client.$(`android=${NOT_NOW_BTN}`).click();
        await Loading();
    };

    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});

//This tests if your password was entered incorrectly
test('Incorrect Password', async() =>{
    //Set Input to Selected Elements
    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS + "n0p3");
    await client.$(LOGIN_BTN).click();

    await Loading();

    const confirmed = await client.$(POPUP).getText();
    expect(confirmed).toBe('Incorrect Password');
});

//This tests if Facebook has the email entered in their database
test('No Account Found', async() =>{
    //Set Input to Selected Elements
    console.log("TESTER");
    console.log(client.$(PASSWORD_TXT_FIELD));
    console.log("TESTER");
    await client.$(EMAIL_TXT_FIELD).setValue('fakemailtester333@gmail.com');
    await client.$(PASSWORD_TXT_FIELD).setValue('fakepassword333!');
    await client.$(LOGIN_BTN).click();

    await Loading();

    const confirmed = await client.$(POPUP).getText();
    console.log(confirmed);
    expect(confirmed).toBe('Need help finding your account?' || 'Login Failed');
});
