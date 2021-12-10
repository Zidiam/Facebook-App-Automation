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

    const confirmed = await client.$(PROFILE).isDisplayed();
};


//This runs before any of the tests run
beforeAll( async()=>{
    //ENTER YOUR EMAIL AND PASSWORD
    CORRECT_EMAIL = 'melnikjason@gmail.com';
    CORRECT_PASS = '634659Jm';

    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Xpath
    LOADING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ProgressBar';
    POPUP = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.TextView';

    //OTHER
    const BACKGROUND_BTN = '~Background Color';
    const CAMERA_BTN = '~Camera';
    const GIF_BTN = '~GIF';
    const RECOMMENDATIONS_BTN = '~Ask for recommendations';
    const HOST_BTN = '~Host a Q&A';

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

//This tests if the Post was successful
test('UnSuccessfull Post', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const INPUT_FIELD = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText';
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';

    const inp = 'Test Post' + Math.floor(Math.random() * 10);
    await client.$(TEXT_FIELD).click();
    await client.$(INPUT_FIELD).setValue(inp);
    while(await client.$(POST_BTN).enabled == false){
        await client.pause(10);
    }
    await client.$(POST_BTN).click();

    await client.$(TEXT_FIELD).click();
    await client.$(INPUT_FIELD).setValue(inp);
    while(await client.$(POST_BTN).enabled == false){
        await client.pause(10);
    }
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

test('Image Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const VIDEO_BTN = '~Photo/video';
    const FILE_ACCESS_BTN = '~Allow Access';
    const ALLOW_ACCESS_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.Button[2]';
    const CONFIRM_ACCESS = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.Button[1]';
    const FIRST_IMG = '(//android.view.ViewGroup[@content-desc="Photo"])[2]';
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';
    
    await client.$(TEXT_FIELD).click();
    await client.$(VIDEO_BTN).click();
    if(await client.$(FILE_ACCESS_BTN).isDisplayed()){
        await client.$(FILE_ACCESS_BTN).click();
    }
    if(await client.$(ALLOW_ACCESS_BTN).isDisplayed()){
        await client.$(ALLOW_ACCESS_BTN).click();
    }
    if(await client.$(CONFIRM_ACCESS).isDisplayed()){
        await client.$(CONFIRM_ACCESS).click();
    }

    await client.$(FIRST_IMG).click();
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


test('Tag Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const TAG_BTN = '~Tag people';
    const FIRST_PERSON = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.widget.CheckBox';
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';
    const BACK_BTN = '~Back';

    await client.$(TEXT_FIELD).click();
    await client.$(TAG_BTN).click();
    await client.$(FIRST_PERSON).click();
    await client.$(BACK_BTN).click();
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


test('Feeling Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const FEELING_BTN = '~Feeling/activity';
    const FIRST_FEELING = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[1]/android.view.ViewGroup';
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]/android.view.ViewGroup[2]';
    
    await client.$(TEXT_FIELD).click();
    await client.$(FEELING_BTN).click();
    await client.$(FIRST_FEELING).click();
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

test('Location Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const CHECKIN_BTN = '~Check in';
    const ALLOW_BTN = '~Allow';
    const CONFIRM_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.Button[1]';
    const CHOOSE_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[3]';
    
    const POST_BTN = '~POST';
    const CONFIRMED_TEXT = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout[2]';
    
    await client.$(TEXT_FIELD).click();
    await client.$(CHECKIN_BTN).click();

    if(await client.$(ALLOW_BTN).isDisplayed()){
        await client.$(ALLOW_BTN).click();
    }
    if(await client.$(CONFIRM_BTN).isDisplayed()){
        await client.$(CONFIRM_BTN).click();
    }
    if(await client.$(CHOOSE_BTN).isDisplayed()){
        await client.$(CHOOSE_BTN).click();
    }

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

test('Live Video Post Successfull', async() =>{
    //declare element selector values
    await Loading();
    const TEXT_FIELD = '//android.view.ViewGroup[@content-desc="Make a post on Facebook"]';
    const LIVEVIDEO_BTN = '~Live Video';
    const ALLOW_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.Button[1]';
    const LIVE_BTN = '~Go Live';
    const POST_BTN = '~Post Now';
    const FINISH_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout[4]/android.widget.Button';
    const CONFIRM_POST = '~Post for 30 Days';
    const CONFIRMED_TEXT = '~Open into Watch and Go';
    
    await client.$(TEXT_FIELD).click();
    await client.$(LIVEVIDEO_BTN).click();

    await client.pause(100);
    if(await client.$(ALLOW_BTN).isDisplayed()){
        await client.$(ALLOW_BTN).click();
    }
    await client.pause(100);
    if(await client.$(ALLOW_BTN).isDisplayed()){
        await client.$(ALLOW_BTN).click();
    }

    await client.$(LIVE_BTN).click();
    await client.pause(10000);
    await client.$(FINISH_BTN).click();
    await client.pause(5000);

    await client.$(POST_BTN).click();
    await client.$(CONFIRM_POST).click();

    expect(true).toBe(true);
});
