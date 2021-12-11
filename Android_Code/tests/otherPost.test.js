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
let TEXT_FIELD;
let CONFIRMED_TEXT;

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
    TEXT_FIELD = '~Make a post on Facebook';

    //Class Name
    LOADING = 'android.widget.ProgressBar';

    //Xpath
    CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';

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

test('Tag Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TAG_BTN = '~Tag People';
    const CHECK_BOX = 'android.widget.CheckBox';
    const POST_BTN = '~POST';
    const BACK_BTN = '~Back';

    await client.$(TEXT_FIELD).click();
    await client.$(TAG_BTN).click();
    await client.$(CHECK_BOX).click();
    await client.$(BACK_BTN).click();
    await client.$(POST_BTN).click();

    let objec;
    objec = await client.$(CONFIRMED_TEXT);
    while(Object.values(objec)[1]['error'] == 'no such element'){
        await client.pause(100);
        objec = await client.$(CONFIRMED_TEXT);
    }

    expect(objec['selector']).toBe(CONFIRMED_TEXT);
});

test('Image Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const VIDEO_BTN = '~Photo/video';
    const FILE_ACCESS_BTN = '~Allow Access';
    const ALLOW_ACCESS_BTN = 'text("ALLOW").className("android.widget.Button")';
    const CONFIRM_ACCESS = 'text("Allow").className("android.widget.Button")';
    const FIRST_IMG = '~Photo';
    const POST_BTN = '~POST';
    
    await client.$(TEXT_FIELD).click();
    await client.$(VIDEO_BTN).click();
    if(await client.$(FILE_ACCESS_BTN).isDisplayed()){
        await client.$(FILE_ACCESS_BTN).click();
    }
    if(await client.$(`android=${ALLOW_ACCESS_BTN}`).isDisplayed()){
        await client.$(`android=${ALLOW_ACCESS_BTN}`).click();
    }
    if(await client.$(`android=${CONFIRM_ACCESS}`).isDisplayed()){
        await client.$(`android=${CONFIRM_ACCESS}`).click();
    }

    await client.$(FIRST_IMG).click();
    await client.$(POST_BTN).click();
    let counter = 0;
    while(await client.$(FIRST_IMG).isDisplayed() == false && counter < 10){
        await client.pause(1000);
        counter += 1;
    }

    expect(true).toBe(await client.$(FIRST_IMG).isDisplayed());
});

test('Feeling Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const FEELING_BTN = '~Feeling/activity';
    const ACTIVITIES_BTN = '~Activities, Tab 2 of 2';
    const FIRST_FEELING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[1]';
    const FIRST_FEELING2 = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[1]/android.view.ViewGroup';
    const POST_BTN = '~POST';
    
    await client.$(TEXT_FIELD).click();
    await client.$(FEELING_BTN).click();
    await client.$(ACTIVITIES_BTN).click();
    await client.$(FIRST_FEELING).click();
    await client.$(FIRST_FEELING2).click();
    await client.$(POST_BTN).click();

    let objec;
    objec = await client.$(CONFIRMED_TEXT);
    while(Object.values(objec)[1]['error'] == 'no such element'){
        await client.pause(100);
        objec = await client.$(CONFIRMED_TEXT);
    }
    console.log(objec);
    expect(objec['selector']).toBe(CONFIRMED_TEXT);
});
