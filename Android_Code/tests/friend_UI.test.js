//login.test.js

//Setup webdriver
const { describe } = require("jest-circus");
const wdio = require("webdriverio");
jest.setTimeout(200000);

//Declare Global Variables
let CURRENT_EMAIL;
let CURRENT_PASS;
let CORRECT_EMAIL1;
let CORRECT_PASS1;
let CORRECT_EMAIL2;
let CORRECT_PASS2;
let client;
let LOADING;
let EMAIL_TXT_FIELD;
let PASSWORD_TXT_FIELD;
let LOGIN_BTN;

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
    const SKIP_CONFIRM = 'text("SKIP").className("android.widget.Button")';
    const NOT_NOW_BTN = 'text("Not Now").className("android.widget.Button")';
    const PROFILE = '~Go to profile';

    await client.$(EMAIL_TXT_FIELD).setValue(CURRENT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CURRENT_PASS);
    await client.$(LOGIN_BTN).click();

    await Loading();

    while(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        if(await client.$(`android=${SKIP_CONFIRM}`).isDisplayed()){
            await client.$(`android=${SKIP_CONFIRM}`).click();
            await Loading();
        };
        if(await client.$(`android=${NOT_NOW_BTN}`).isDisplayed()){
            await client.$(`android=${NOT_NOW_BTN}`).click();
            await Loading();
        };
    }
    await client.$(PROFILE).isDisplayed();
};


//This runs before any of the tests run
beforeAll( async()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL1 = 'maczfet_alisonson_1639161003@tfbnw.net';
    CORRECT_PASS1 = 'xyqk8ru0550';
    CORRECT_EMAIL2 = 'wnmjidc_adeagboberg_1638509055@tfbnw.net';
    CORRECT_PASS2 = 'o4sn54eh989';
    CURRENT_EMAIL = CORRECT_EMAIL1;
    CURRENT_PASS = CORRECT_PASS1;
    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Xpath
    LOADING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ProgressBar';
    
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

//Tests Friends Requests between two users
test('Test Friend Request', async() =>{
    //declare element selector values
    await Loading();
    const CANCEL_BTN = '//android.widget.Button[@content-desc="Cancel"]/android.widget.ImageView';
    const CANCEL_CONFIRM = '~android:id/button1';
    const PROFILE_BTN = '~Go to profile';
    const SEARCH_BAR = '~Search Facebook';
    const SEARCH_BAR_CONFIRM = 'text("Search").className("android.widget.EditText")';
    const FRIEND_URL = 'https://www.facebook.com/profile.php?id=100075731105635';
    const FRIEND_BUTTON = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup[2]';
    const BACK_BTN = '~Back';
    const HOME_BTN = '~News Feed, Tab 1 of 5';

    const FRIENDS_BUTTON = '~Friends, Tab 2 of 6';
    const FRIEND_CONFIRM_BTN = '~Confirm Richard Algegcaajefce Huiberg\'s friend request';
    const FRIEND_LIST = '~Your Friends';
    const FRIEND = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[2]';
    const MORE_BTN = '~More';
    const COPY_LINK = '~Copy Link';

    //First Account Adding Second Account
    await client.$(PROFILE_BTN).click();

    await client.touchAction({
        action: 'tap',
        x: 500,
        y: 500
    });
    await client.$(MORE_BTN).click();
    await client.$(COPY_LINK).click();
    var profile1 = await client.getClipboard();
    await client.$(BACK_BTN).click();
    await client.$(HOME_BTN).click();
    await client.$(SEARCH_BAR).click();
    await client.$(`android=${SEARCH_BAR_CONFIRM}`).click();
    await client.$(":focused").setValue(FRIEND_URL);
    await client.pause(1000);
    await client.$(FRIEND_BUTTON).click();
    await client.pause(1000);
    //Second Account Confirming First Account
    CURRENT_EMAIL = CORRECT_EMAIL2;
    CURRENT_PASS = CORRECT_PASS2;
    await client.deleteSession();
    client = await wdio.remote(opts);
    await LogIn();
    await Loading();

    await client.$(FRIENDS_BUTTON).click();
    await client.$(FRIEND_CONFIRM_BTN).click();
    await client.$(FRIEND_LIST).click();
    await client.$(FRIEND).click();
    await client.$(MORE_BTN).click();
    await client.$(COPY_LINK).click();
    var profile2 = await client.getClipboard();
    expect(profile1).toBe(profile2);
});