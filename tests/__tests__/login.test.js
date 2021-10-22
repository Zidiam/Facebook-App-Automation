const wdio = require("webdriverio");
jest.setTimeout(20000);

let client;

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

afterAll( async() => {
    await client.deleteSession();
});

test('Connected', async() =>{
    client = await wdio.remote(opts);
    expect(Object.values(client)[1]['appPackage']).toBe('com.facebook.katana');
});

test('Logging In', async() =>{
    //declare element selector values
    const EMAIL_TXT_FIELD = '~Username'
    const PASSWORD_TXT_FIELD = '~Password'
    const LOGIN_BTN = '~Log In'
    const SKIP = '~Skip'
    const PROFILE = '~Go to profile'
    
    await client.$(EMAIL_TXT_FIELD).setValue('email');
    await client.$(PASSWORD_TXT_FIELD).setValue('pass');
    await client.$(LOGIN_BTN).click();
    await client.pause(6000);
    if(await client.$(SKIP).isDisplayed()){
        await client.$(SKIP).click();
        await client.pause(1000);
    }
    const confirmed = await client.$(PROFILE).isDisplayed();
    expect(confirmed).toBe(true);
});