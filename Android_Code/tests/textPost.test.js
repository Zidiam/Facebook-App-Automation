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
    await client.pause(1000);
    while(await client.$(LOADING).isDisplayed()){
        await client.pause(1000);
    };
}

async function LogIn(){
    //Set Variable
    const SKIP = '~Skip';
    const SKIP_CONFIRM = 'text("SKIP").className("android.widget.Button")';
    const NOT_NOW_BTN = 'text("Not Now").className("android.widget.Button")';

    await client.$(EMAIL_TXT_FIELD).setValue(CORRECT_EMAIL);
    await client.$(PASSWORD_TXT_FIELD).setValue(CORRECT_PASS);
    await client.$(LOGIN_BTN).click();

    await Loading();

    //Skip popups
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
};


//This runs before any of the tests run
beforeAll( async()=>{
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
    const INPUT_FIELD = 'text("What\'s on your mind?").className("android.widget.EditText")';
    const POST_BTN = '~POST';
    const POST_OPTIONS = 'text("Post Menu").className("android.view.ViewGroup")';
    const EDIT_POST = 'text("Edit post").className("android.widget.TextView")';
    
    await client.$(TEXT_FIELD).click();
    await client.$(`android=${INPUT_FIELD}`).click();
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

//This tests if the Post was successful
test('UnSuccessfull Post', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '~Make a post on Facebook';
    const INPUT_FIELD = 'text("What\'s on your mind?").className("android.widget.EditText")';
    const POST_BTN = '~POST';
    const POST_OPTIONS = 'text("Post Menu").className("android.view.ViewGroup")';
    const post_text = 'Test Post' + Math.floor(Math.random() * 10);
    
    //First Post
    await client.$(TEXT_FIELD).click();
    await client.$(`android=${INPUT_FIELD}`).click();
    await client.$(":focused").setValue(post_text);
    await client.$(POST_BTN).click();
    await client.pause(1000);

    //Second Post
    await client.$(TEXT_FIELD).click();
    await client.$(`android=${INPUT_FIELD}`).click();
    await client.$(":focused").setValue(post_text);
    await client.$(POST_BTN).click();
    await client.pause(1000);

    //Check
    const confirmed = await client.$(`android=${POST_OPTIONS}`).isDisplayed();

    expect(confirmed).toBe(false);
});