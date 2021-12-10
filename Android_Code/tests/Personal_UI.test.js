//login.test.js

//Setup webdriver
const { describe } = require("jest-circus");
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

    await client.$(PROFILE).isDisplayed();
};


//This runs before any of the tests run
beforeAll( async()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL = 'zidiamgaming@gmail.com';
    CORRECT_PASS = '634659Jm';

    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Xpath
    LOADING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ProgressBar';
    POPUP = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.TextView';

    client = await wdio.remote(opts);
    await LogIn();
});

//This runs after each test
afterAll( async() => {
    await client.deleteSession();
});

//This checks if the connection was successful
test('Connected', async() =>{
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

//This tests if the Post was successful
test('Like Button Works', async() =>{
    //declare element selector values
    await Loading();
    const PROFILE_BTN = '~Go to profile';
    const POST = '/hierarchy/android.widget.FrameLayout';
    const LIKE_BTN = '(//android.widget.Button[@content-desc="Like button. Double tap and hold to react."])[1]';
    await client.$(PROFILE_BTN).click();
    await client.pause(500);
    await client.$(POST).touchAction([
        { action: 'press', x: 0, y: 1000 },
        { action: 'moveTo', x: 0, y: -3000 },
        'release'
    ])
    await client.pause(500);
    var elem = await client.$(LIKE_BTN);
    await elem.click();
    var val = await elem.isEnabled();
    await client.pause(500);
    expect(val).toBe(true);
});


//This tests if the Post was successful
test('Correct Number of Likes', async() =>{
    //declare element selector values
    await Loading();
    const PROFILE_BTN = '~Go to profile';
    const POST = '/hierarchy/android.widget.FrameLayout';
    const PEOPLE_DISPLAYED = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[3]';
    await client.$(PROFILE_BTN).click();
    await client.pause(500);
    await client.$(POST).touchAction([
        { action: 'press', x: 0, y: 1000 },
        { action: 'moveTo', x: 0, y: -3000 },
        'release'
    ])
    await client.pause(500);
    await client.$(PEOPLE_DISPLAYED).click();

    var amountLikes = 1;
    while(await client.$(PEOPLE_DISPLAYED.substring(0, temp.length-2) + String(amountLikes) + "]").isDisplayed()){
        amountLikes += 1;
    };
    expect(await client.$('android.widget.TextView*=Tab 1 of 1') == amountLikes).toBe(true);
});

























/*
//This tests if the Post was successful
test('Correct Number of Likes', async() =>{
    //declare element selector values
    await Loading();
    const PROFILE_BTN = '~Go to profile';
    const POST = '/hierarchy/android.widget.FrameLayout';
    const PEOPLE_DISPLAYED = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[3]';
    await client.$(PROFILE_BTN).click();
    await client.pause(500);
    await client.$(POST).touchAction([
        { action: 'press', x: 0, y: 1000 },
        { action: 'moveTo', x: 0, y: -3000 },
        'release'
    ])
    await client.pause(500);
    await client.$(PEOPLE_DISPLAYED).click();
    //await client.$('android.widget.TextView*=Tab 1 of 1').getText();
    //await client.pause(10000);
    expect(await client.$('~2 Like, Tab 1 of 1').isDisplayed()).toBe(true);
});
*/