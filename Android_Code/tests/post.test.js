//login.test.js

//Setup webdriver
const { describe } = require("jest-circus");
const wdio = require("webdriverio");
jest.setTimeout(200000);

//Declare Global Variables
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
    const PROFILE = '~Go to profile';

    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL1);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS1);
    await client.$(LOGIN_BTN).click();

    await Loading();

    while(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        if(await client.$(`android=${SKIP_CONFIRM}`).isDisplayed()){
            await client.$(`android=${SKIP_CONFIRM}`).click();
            await Loading();
        };
    }

    await client.$(PROFILE).isDisplayed();
};


//This runs before any of the tests run
beforeAll( async()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL1 = 'fekvtxc_chengwitz_1638509068@tfbnw.net';
    CORRECT_PASS1 = 'ogct5b65vc1';

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

//This tests if the Post was successful
test('Successfull Post', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '~Make a post on Facebook';
    const INPUT_FIELD = '~Write something…';
    const POST_BTN = '~POST';
    const POST_OPTIONS = '~Post Menu';
    const EDIT_POST = 'text("Edit post").className("android.widget.TextView")';
    
    await client.$(TEXT_FIELD).click();
    await client.$(INPUT_FIELD).click();
    const post_text = 'Test Post' + Math.floor(Math.random() * 10);
    await client.$(":focused").setValue(post_text);
    await client.$(POST_BTN).click();
    await client.pause(1000);
    await client.$(POST_OPTIONS).click();
    await client.$(`android=${EDIT_POST}`).click();
    
    const test_post = 'text("' + post_text + '").className("android.widget.EditText")';
    const confirmed = await client.$(`android=${test_post}`).isDisplayed();
    expect(confirmed).toBe(true);
});
