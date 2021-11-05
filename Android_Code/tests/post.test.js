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

async function LogIn(){
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
};

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
    LogIn();
});

//This runs after each test
afterEach( async() => {
    await client.deleteSession();
});

//This checks if the connection was successful
test('Connected', async() =>{
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

//This tests if the Post was successful
test('Successfull Post', async() =>{
    //declare element selector values
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const INPUT_FIELD = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText';
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';

    await client.$(TEXT_FIELD).click();
    await client.$(INPUT_FIELD).setValue('Test Post' + Math.floor(Math.random() * 10));
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS);
    await client.$(POST_BTN).click();

    await Loading();

    const confirmed = await client.$(CONFIRMED_TEXT).isDisplayed();
    expect(confirmed).toBe(true);
});