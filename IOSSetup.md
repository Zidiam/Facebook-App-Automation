# IOS Tutorial:

This code will test Facebooks app features on Android. This will use Jest for the testing. Appium and WebDriverIO is for automating the tasks.

## Windows
This tutorial can only work on MAC OS so you will need to do this [tutorial](https://techschumz.com/install-macos-monterey-on-virtualbox-on-windows-10/) to run a virtual mac on your windows machine. The rest of the tutorial will be done on the mac machine.

## Required Downloads

[Node.js](https://nodejs.org/en/download/)

[Xcode](https://developer.apple.com/xcode/)

[Homebrew](https://brew.sh/)

[Appium](https://github.com/appium/appium-desktop/releases)

[Appium Inspector](https://github.com/appium/appium-inspector/releases)

[Visual Studio Code](https://code.visualstudio.com/download)

##Download Simulator
Open Xcode and install all tools and go through installation.

On the top bar click Xcode and in the dropdown press Preferences.

Then press components and download the latest simulator.

##Terminal Commands
```bash
xcode-select --install
brew install carthage
mkdir Facebook-App-Automation
cd Facebook-App-Automation
npm init -y
npm install webdriverio
npm i jest
code .
```

## Setup Files
Open package.json and change "test" value to "jest"

Create a folder named `tests` and create another folder inside named `__tests__`

Inside the `__tests__` folder create a file named login.test.js

Directory should look like this:
```bash
-node_modules
-tests\__tests__
    -login.test.js
-package-lock.json
-package.json
```
## Appium
Open Appium Server GUI and Appium Inspector

In Appium GUI click 'Start Server' the default values should be Host: 0.0.0.0 and Port: 4723

In Appium Inspector input `/wd/hub` into Remote Path

### Input in the Desired Capabilities Tab:

After each input click the "+" button to add another input line

Name: `platformName` Value: `iOS`

Name: `deviceName` Value: `iPhone 12 Pro Max`

Name: `automationName` Value: `XCUITest`

Name: `platformVersion` Value: `14.5`

Name: `browserName` Value: `Safari`

Your JSON Representation should look like:

```bash
{
  "platformName": "iOS",
  "deviceName": "iPhone 12 Pro Max",
  "automationName": "XCUITest",
  "platformVersion": "14.5",
  "browserName": "Safari"
}
```

Then checkmark the 'Automatically add necessary Appium vendor prefixes on start'

Click 'Save As...' and name it 'facebookapi'

Then click 'Start Session' This should open the safari on the simulator.

## Appium Inspector

Now that you have the Facebook app on your Appium Inspector you can find elements and test those elements.

On the top hotbar click the refresh button to make sure you are seeing the samething on your inspector and emulator

### Getting 'accessibility id' elements

In Appium Inspector

Click on the '' input

On the right you will 'Selected Element'. In this you will see two tabs with 'Find By' and 'Selector'. In the 'Find By' tab you will see 'accessibility id
' with the 'Selector' being ''. '' is important for when we start coding. Now do the same for '' and the '' button and get their 'accessibility id'. 

You should now have three values '', '', ''

### Using the Inspector
You can use the Safari app on the emulator to get to a desired page. To view the desired page on the Appium Inspector you can click the refresh button on the top. This will now let you find elements you need to find which we will use later on.

Example:

Using Safari app to go to the Facebook website. Then refreshing on the Inspector to get the `` element id. Then clicking the `` on the Facebook App to get to the login page. Refresh on the Inspector again to get the `` element id so we can confirm the login.
