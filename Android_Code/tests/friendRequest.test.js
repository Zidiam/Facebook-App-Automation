//login.test.js

//Setup webdriver
const wdio = require("webdriverio");
jest.setTimeout(200000);

//Declare Global Variables
let CORRECT_EMAIL;
let CORRECT_PASS;
let CORRECT_EMAIL1;
let CORRECT_PASS1;
let CORRECT_EMAIL2;
let CORRECT_PASS2;
let client;
let LOADING;
let EMAIL_TXT_FIELD;
let PASSWORD_TXT_FIELD;
let LOGIN_BTN;
let name1;
let name2;
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
    //CORRECT_EMAIL1 = 'lhyqhaz_zamoresen_1639163329@tfbnw.net';
    //CORRECT_PASS1 = 'kkvhre3e2xn';
    CORRECT_EMAIL1 = 'bnymjkf_wisemanwitz_1639186308@tfbnw.net';
    CORRECT_PASS1 = 'wemwr1rhqtv';
    CORRECT_EMAIL2 = 'zhquyzs_liangberg_1639210718@tfbnw.net';
    CORRECT_PASS2 = 'gwuvmjquwl4';
    CORRECT_EMAIL = CORRECT_EMAIL1;
    CORRECT_PASS = CORRECT_PASS1;
    //Accessibility ID
    EMAIL_TXT_FIELD = '~Username';
    PASSWORD_TXT_FIELD = '~Password';
    LOGIN_BTN = '~Log In';

    //Xpath
    LOADING = 'android.widget.ProgressBar';
    
    client = await wdio.remote(opts);
    await LogIn();
});

//This runs after all the tests
afterAll( async() => {
    await client.deleteSession();
});

//This checks if the connection was successful
test('Connected', async() =>{
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});



//Test sending a friend request
test('Send Friend Request', async() =>{
    //declare element selector values
    await Loading();
    const CANCEL_BTN = '//android.widget.Button[@content-desc="Cancel"]/android.widget.ImageView';
    const CANCEL_CONFIRM = '~android:id/button1';
    const PROFILE_BTN = '~Menu, Tab 5 of 5';
    const PRIVACY_BTN = '~Settings & Privacy, Header. Section is collapsed. Double-tap to expand the section.';
    const SETTINGS_BTN = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.viewpager.widget.ViewPager/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[4]/android.view.ViewGroup';
    const ACCOUNT_BTN = '~Personal and Account Information';

    const SEARCH_BAR = 'text("Search").className("android.widget.EditText")';
    const FRIEND_SEARCH = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[2]';
    const USER_BTN = '~Profile picture';
    const REQUEST_BTN = '~Add Friend';
    const CLOSE_BTN = '~Close';
    //First Account Adding Second Account
    await client.$(PROFILE_BTN).click();
    if(await client.$(CANCEL_BTN).isDisplayed()){
        await client.$(CANCEL_CONFIRM).click();
    }
    await client.touchAction([
        { action: 'longPress', x: 20, y: 550 },
        { action: 'moveTo', x: 0, y: -4000},
        'release'
    ]);
    await client.pause(1000);
    await client.$(PRIVACY_BTN).click();
    await client.$(SETTINGS_BTN).click();
    await client.$(ACCOUNT_BTN).click();
    name1 = await client.$('android.widget.Button').$$('android.widget.TextView')[1].getText();

    //Second User
    CORRECT_EMAIL = CORRECT_EMAIL2;
    CORRECT_PASS = CORRECT_PASS2;
    await client.reloadSession();
    await LogIn();
    
    if(await client.$('~Search').isDisplayed()){
        await client.$('~Search').click();
    }
    else if(await client.$('~Search Facebook').isDisplayed()){
        await client.$('~Search Facebook').click();
    }
    await client.$(`android=${SEARCH_BAR}`).click();
    //name1 = name1.substr(0, name1.length-5);
    try{
        await client.keys(name1);
    }
    catch(error){
        let temps = true;
    }
    //await client.$(":focused").setValue(name1);
    if (await client.$(FRIEND_SEARCH).isDisplayed()){
        await client.$(FRIEND_SEARCH).click();
    }
    else{
        await client.pressKeyCode(66);
        await client.$(USER_BTN).click();
    }
    await client.$(REQUEST_BTN).click();
    await client.$(CLOSE_BTN).click();

    expect(true).toBe(await client.$('~Requested').isDisplayed());
});
