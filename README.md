# <img title="Reddit Favicon" src="https://www.reddit.com/favicon.ico" width="27"/> Reddit User Widget for Scriptable

![](https://img.shields.io/badge/dynamic/json?color=FF4B1B&style=plastic&label=Script%20Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2FReddit-Widget%2Fmain%2FReddit-Widget.json "Hi there 👋 I'm always up to date")


Widget which shows your <img align="center" title="Karma Symbol" src="Images/karma.png" width="17"> Karma, <img align="center" title="Coin Symbol" src="Images/coins.png" width="15"> Coin-Balance, <img align="center" title="Cakeday Symbol" src="Images/cakedayApollo.png" width="18"> Cakeday, Profile Image etc.

<img title="Header Banner" src="Images/Screenshots/haederBanner2.png" width="1000" align="center">
<br>
<br>

**1.2 Update Notes** (July 20th 2022)
   - Script Saves and pulls reddit login datas on device (~ iCloud/Scriptable/Reddit-Widget/LoginDatas.json)
   - Downloads once profile image & app icons to iCloud for less mobile data usage
   - Added 'Delete Menu ⌦' for Downloaded Files
   - added first / error widget for all sizes
   - Added unread messages badge for large widget, too!
   - Added the reddit web-favicon and ReSurfer (_amazing reddit client, check it out_) as icon option.
   - Added the option to use the web-browser instead of reddit, apollo or ReSurfer app (_If you also have the reddit app installed, iOS will first open the reddit app instead of the browser_)
   - Fixed bug where long karma numbers may displayed cutted off in the small-widget
   - Small design and functionality improvements

<br>

**1.1 Update Notes** (May 05th 2022)
   - Updated Function for calculating karma numbers `(e.g. 1494 = 1.494K; 20567 = 20.57K; 1000000 = 1M etc.)`
   - Added Feature notification Badge also for Medium Widget
   - Added selfupdate function[^1]

<br>

**Known Issues**
   - Long **usernames** (_up to 13 symbols_) may not display correctly (_Small-Widget_)
   - Long **usertitles** may not be displayed correctly in conjunction with **username** (_Medium-Widget_)
   - and some small other bugs...

<br>

**Next Update Includes**
   - Push-Notifications when today is your Cakeday and new reached Karma score (_25 point steps_)

<br>


## Widget Overview


### Theme
The Widget has a **Dynamic Gradient Background**

<img title="Darkmode - Medium Sized Widget" src="Images/Screenshots/darkmodeGradient.png" width="250" align="center"> <img title="Lightmode - Medium Sized Widget" src="Images/Screenshots/lightmodeGradient.png" width="250" align="center">

<br>

### First Run
When you add the widget but also saved your login datas (via script) youll get the Error/First Run Widget.    
Open the Script an Enter your Datas from Reddit.

<img title="Preview Error/First Run Widget" src="Images/Screenshots/previewError-FirstRun_Widgets.png" width="500" align="center">

<br>

### Happy Cakeday
Today is your Cakeday!? The widget will tell you subtly.  

<img title="Cakeday Banner" src="Images/Screenshots/cakedayBanner2.png" width="1000" align="center">

<br>

## ⚙️ SETUP

### Create Personal Reddit App/Script

1. Login to your Account and go to https://old.reddit.com/prefs/apps/

2. Create new **Personal Script**
<img title="create another app..." src="Images/Screenshots/create_personal_script[step1].png" width="850">

3. Click Checkbox "script" and set a redirect uri (e.g. same as in the image)
<img title="config app parameter" src="Images/Screenshots/create_application[step2].png" width="850">

4. Create App

5. Copy Client_ID & Client_Secret
<img title="get app parameter" src="Images/Screenshots/new_application[step3].png" width="850">

6. Config Script

```javascript
const refreshInt = 90 //in minutes
const enableNotifications = true //PUSH NOTIFICATIONS ARE MAYBE IN THE NEXT UPDATE
const showNotifyBadge = true //all widget sizes
const showCoinBalance = true //small- & medium widget
const showUserTitle = true //medium- & large widget
const clientIcon = 'https' //small- & medium widget
const cornerRadiusProfileImg = 0 //Set this to +25 for a rounded Image
const urlScheme = 'https'
/*
APP URL-SCHEMES
Apollo = apollo,
Reddit = reddit,
ReSurfer = surfer,
Narwahl = narwahl,
Web-Browser = https
*/
```
Official Reddit API Guidelines: https://github.com/reddit-archive/reddit/wiki/OAuth2

Helper-Shortcut for downloading App-Icon-URLs from the App-Store: https://routinehub.co/shortcut/11635/
___

### Run Script In App

By running the scirpt In App it will present a menu including _Username_, _Total Karma_, _Coin Balance_ & _Unread Inbox Count_ at the Top.
You can choose one of the following three options in the sheet: Show small-, medium-, largewidget or open your profile in your standard Reddit-Client ([Create Personal Reddit App/Script - 6. Config Script](https://github.com/iamrbn/Reddit-Widget/edit/main/README.md#-create-personal-reddit-appscript))

<img title="runInApp" src="Images/Screenshots/runInApp.png" width="250" align="center">


## Installing

### Install Script
1. Install [Scriptable for iOS `↗`](https://apps.apple.com/us/app/scriptable/id1405459188?ign-mpt=uo%3D4 "App Store")
2. Copy **each line** of the [Script `↗`](https://raw.githubusercontent.com/iamrbn/Reddit-Ridget/main/Reddit-Widget.js)
or download [this](https://routinehub.co/shortcut/10438/) helper shortcut
3. `+` Add new Script

<img title="" src="https://github.com/iamrbn/slack-status/blob/0fd4225b87fa60148bb652e258962b588b3c4a3f/Images/addNewScript.png" width="250">

4. Paste it into the new Script
5. Finish

### Add Widget To Homescreen
1. Go to your homescreen and long tab anywhere
2. By tapping the `+` it will opens the gallery
3. chose or search for scriptable
4. Chose the widget-size and tap `"Add Widget"`
5. Tap the widget and choose the script, then set `"When Interacting" = "Run Script"` 
6. [Set the widget Parameters](https://github.com/iamrbn/Reddit-Widget/edit/main/README.md#set-widget-parameter) (if you want)
7. Done

### On First Run

It will Downloads and Save the Following Symbols at the directory "Reddit-Widget"

<img title="karma" src="Images/karma.png" width="50" align="center"> <img title="coins" src="Images/coins.png" width="50" align="center"> <img title="cakedayApollo" src="Images/cakedayApollo.png" width="50" align="center"> <img title="cakedayConfetti" src="Images/cakedayConfetti.png" width="100" align="center"> <img title="https" src="https://www.reddit.com/favicon.ico" width="50" align="center"> <img title="profileIcon example" src="https://styles.redditmedia.com/t5_5u9idf/styles/profileIcon_snoo7d9ec1b8-e699-4f89-98ed-92cea07007b5-headshot.png" width="50" align="center"> 

```
iCloud Drive/
├─ Scriptable/
│  ├─ Reddit-Widget/
│  │  ├─ karma.png
│  │  ├─ coins.png
│  │  ├─ cakedayApollo.png
│  │  ├─ cakedayConfetti.png
│  │  ├─ Apollo.png
│  │  ├─ Reddit.png
│  │  ├─ ReSurfer.png
│  │  ├─ https.png
│  │  ├─ profileIcon.png
---- alternative symbols ----
│  │  ├─ coins2.png
│  │  ├─ cakedayReddit.png
```
<img title="coins2" src="Images/coins2.png" width="50" align="center"> <img title="cakedayReddit" src="Images/cakedayReddit.png" width="66" align="center">


<h2 style="font-size:1"
<p align="center" style="font-size:10vw">
   <a href="https://github.com/iamrbn/Reddit-Widget/blob/main/README.md#reddit-user-widget-for-scriptable-"> ⬆️ Jump Back To Start </a>
</p>
</h2>
 
<p align="center">
  <a href="https://reddit.com/user/iamrbn/">
    <img title="My first Reddit @iamrbn" src="https://github.com/iamrbn/slack-status/blob/08d06ec886dcef950a8acbf4983940ad7fb8bed9/Images/Badges/reddit_black_iamrbn.png" width="150"/>
  </a>
  <a href="https://twitter.com/iamrbn_/">
    <img title="Follow Me On Twitter @iamrbn_" src="https://github.com/iamrbn/slack-status/blob/ae62582b728c2e2ad8ea6a55cc7729cf71bfaeab/Images/Badges/twitter_black.png" width="155"/>
  </a>
</p>


[^1]:[Function](https://github.com/mvan231/Scriptable#updater-mechanism-code-example "GitHub Repo") is written by the amazing [@mvan231](https://twitter.com/mvan231 "Twitter") - Thx for your Support
