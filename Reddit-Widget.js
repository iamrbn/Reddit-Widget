// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: robot;
// Created by - iamrbn
// Script URL: https://github.com/iamrbn/Reddit-Widget


// ==============================================
// ============= CONFIG ZONE ====================
// ==============================================

const appIcons = {//shortcut to get app-icon-urls from app-store: https://routinehub.co/shortcut/11635/
https:'https://www.reddit.com/favicon.ico',
Reddit:'https://is5-ssl.mzstatic.com/image/thumb/Purple126/v4/e8/a6/65/e8a66539-19c0-2748-3f7d-2b0797ca602d/source/512x512bb.png',
Apollo:'https://is2-ssl.mzstatic.com/image/thumb/Purple126/v4/d8/d8/f4/d8d8f4a8-41fb-4cef-2167-0d3589c25b5d/source/512x512bb.png',
ReSurfer:'https://is4-ssl.mzstatic.com/image/thumb/Purple122/v4/3d/c8/ce/3dc8cef9-6d54-eda9-1893-1ca9dbcc720f/AppIcon-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/512x512bb.png'};

const refreshInt = 90 //in minutes
const enableNotifications = true
const showNotifyBadge = true //all widget sizes
const showCoinBalance = true //small- & medium widget
const showUserTitle = true //medium- & large widget
const clientIcon = 'https' //small- & medium widget
const cornerRadiusProfileImg = 0 //Set this to +25 for a rounded Image
const urlScheme = 'https'
/*+++++++++++++++++++++++
APP URL-SCHEMES
Apollo = apollo,
Reddit = reddit,
ReSurfer = surfer,
Narwahl = narwahl,
Web-Browser = https
+++++++++++++++++++++++*/

//=============================================
// ============= END CONFIG ZONE ==============
//=============================================

let scriptURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Reddit-Widget.js';
let scriptVersion = '1.2';
let df = new DateFormatter();
    df.dateFormat = 'MMMM dd, yyyy';   
let widgetSize = config.widgetFamily;
let fm = FileManager.iCloud();
let nKey = Keychain;
let nParameter = await args.notification;
let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget');
if (!fm.fileExists(dir)) fm.createDirectory(dir);
let jsonPath = fm.joinPath(dir, 'LoginDatas.json');
let txtBGColor = Color.dynamic(new Color('#D5D7DCA6'), new Color('#242424A6'));
let txtColor = Color.dynamic(Color.black(), Color.white());
let top = Color.dynamic(new Color('#ffffff'), new Color('#0F2D60'));
let middle = Color.dynamic(new Color('#EDEDED'), new Color('#000427'));
let bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#000000'));
let bgGradient = new LinearGradient();
    bgGradient.locations = [0, 0.4, 1];
    bgGradient.colors = [top, middle, bottom];
    
if (config.runsInApp && fm.fileExists(jsonPath)) {
   await getFromAPI();
   await saveAllImages();
   await presentMenu();
} else if (config.runsInApp && !fm.fileExists(jsonPath)) {
   await askForLoginDatas();
   await getFromAPI();
   await saveAllImages();
   await presentMenu();
};

if (config.runsInWidget) {
  switch (widgetSize) {
    case "small": //widget = await createSmallWidget();
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(12, 13, 12, 11);
     else widget = await createSmallWidget()
    break;
    case "medium":
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(14, 17, 16, 16);
     else widget = await createMediumWidget()
    break;
    case "large":
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(25, 19, 22, 20);
     else widget = await createLargeWidget()
    break;
    default: widget = await createErrorWidget();
  }
  Script.setWidget(widget)
} else if (config.runsInNotification) QuickLook.present(await getImageFor(nParameter.userInfo.img));




// ******** CREATE SMALL WIDGET *********
async function createSmallWidget() {
  let data = await getFromAPI();
  let widget = new ListWidget();
      widget.setPadding(7, 6, 2, 6);
      widget.url = urlScheme+profileURL
      widget.refreshAfterDate = new Date(Date.now() + 1000*60* refreshInt);
      
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4)) {
      cDtrue = ' 🍰'
      widget.backgroundImage = await getImageFor("cakedayConfetti")
} else {
      cDtrue = ''
      widget.backgroundGradient = bgGradient
  }
  
  let mainHeaderStack = widget.addStack()
  
  //Left Header
  let leftMainHeaderStack = mainHeaderStack.addStack()
      leftMainHeaderStack.backgroundColor = txtBGColor
      leftMainHeaderStack.cornerRadius = 11
      leftMainHeaderStack.setPadding(0, 5, 4, 6)
      leftMainHeaderStack.centerAlignContent()
  
  let leftHeaderStackL = leftMainHeaderStack.addStack()
      leftHeaderStackL.layoutVertically()
      leftHeaderStackL.setPadding(5, 0, 0, 0)
     
  
  let rightHeaderStackL = leftMainHeaderStack.addStack()
      rightHeaderStackL.layoutVertically()
      rightHeaderStackL.setPadding(4, 5, 0, 0)
  
  let rightMainHeaderStack = mainHeaderStack.addStack()
  
  //Header Right
  let leftHeaderStackR = rightMainHeaderStack.addStack()
      leftHeaderStackR.layoutVertically()
  
  let rightHeaderStackR = rightMainHeaderStack.addStack()
      rightHeaderStackR.layoutVertically()
      rightHeaderStackR.cornerRadius = 6  


  let appIconElement = leftHeaderStackL.addImage(await getImageFor(clientIcon))
      appIconElement.imageSize = new Size(30, 30);
      appIconElement.cornerRadius = 6
      appIconElement.centerAlignImage()
  
      widget.addSpacer(5)
      leftMainHeaderStack.addSpacer(5)
  
  let wTitle = rightHeaderStackL.addText('reddit')
      wTitle.font = Font.boldRoundedSystemFont(16)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()

  let mSF = (userName.length > 13) ? 0.8 : 0.9;
  let wSubtitle = rightHeaderStackL.addText(userName)
      wSubtitle.font = Font.regularRoundedSystemFont(12)
      wSubtitle.textColor = txtColor
      wSubtitle.minimumScaleFactor = mSF
      wSubtitle.centerAlignText()
      wSubtitle.lineLimit = 1  
  
 if (showNotifyBadge && inboxCount > 0) {
  let badgeSymbolElement = rightHeaderStackR.addImage(SFSymbol.named(`${inboxCount}.circle`).image);
      badgeSymbolElement.imageSize = new Size(15, 15);
      badgeSymbolElement.tintColor = Color.red();
    };

      widget.addSpacer(3);
  
  let mainStack = widget.addStack()
      mainStack.backgroundColor = txtBGColor
      mainStack.layoutVertically()
      mainStack.cornerRadius = 11
      mainStack.setPadding(7, 5, 7, 1)
      mainStack.centerAlignContent()

  let lineOneStack = mainStack.addStack()
      lineOneStack.centerAlignContent()
      lineOneStack.spacing = 4
      
      addString(lineOneStack, await getImageFor('karma'), 0, 14, totalKarma, 11, 1.0);
  if (showCoinBalance) {
      addText(lineOneStack, ' | ', 11, 0.4);
      addString(lineOneStack, await getImageFor('coins'), 0, 12, coinBalance, 11, 1.0);
}

      mainStack.addSpacer(4)
      lineOneStack.addSpacer()
  
  let line3 = mainStack.addText("Post Karma: " + postKarma)
      line3.font = Font.regularRoundedSystemFont(11)
      line3.textColor = txtColor
  
  let line4 = mainStack.addText("Comment Karma: " + commentKarma)
      line4.font = Font.regularRoundedSystemFont(11)
      line4.textColor = txtColor
  
  let line5 = mainStack.addText("Awarder Karma: " + awarderKarma)
      line5.font = Font.regularRoundedSystemFont(11)
      line5.textColor = txtColor
  
  let line6 = mainStack.addText("Awardee Karma: " + awardeeKarma)
      line6.font = Font.regularRoundedSystemFont(11)
      line6.textColor = txtColor
      
  let uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      line7 = mainStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.mediumMonospacedSystemFont(11)
      line7.textColor = Color.red();
}

      widget.addSpacer(4)
  
      df.useShortTimeStyle()
  let footer = widget.addText("Last Refresh " + df.string(new Date()))
      footer.font = Font.regularRoundedSystemFont(8);
      footer.textColor = txtColor
      footer.textOpacity = 0.3
      footer.centerAlignText();
  
  return widget
};


//********** CEEATE MEDIUM WIDGET *********
async function createMediumWidget() {
  let data = await getFromAPI()
  let widget = new ListWidget()
      widget.setPadding(11, 15, 3, 15)
      widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4)) widget.backgroundImage = await getImageFor("cakedayConfetti")
  else widget.backgroundGradient = bgGradient

  let widgetStack = widget.addStack()
      widgetStack.setPadding(0, 0, 0, -15)
   
  let widgetStackL = widgetStack.addStack()
      widgetStackL.setPadding(0, 0, 0, 0)
      widgetStackL.layoutVertically()
  
  let mainHeaderStackLeft = widgetStackL.addStack()
      mainHeaderStackLeft.backgroundColor = txtBGColor
      mainHeaderStackLeft.setPadding(3, 5, 2, 7)
      mainHeaderStackLeft.cornerRadius = 10
      mainHeaderStackLeft.url = urlScheme+profileURL
      mainHeaderStackLeft.centerAlignContent()
  
  let leftHeaderStack = mainHeaderStackLeft.addStack()
      leftHeaderStack.layoutVertically()
  
  let rightHeaderStack = mainHeaderStackLeft.addStack()
      rightHeaderStack.layoutVertically()
      rightHeaderStack.setPadding(0, 5, 0, 0)
  
  
  let appIconElement = leftHeaderStack.addImage(await getImageFor(clientIcon))
      appIconElement.imageSize = new Size(31, 31);
      appIconElement.cornerRadius = 7
  
  let wTitle = rightHeaderStack.addText('reddit')
      wTitle.font = Font.boldRoundedSystemFont(16)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()
      
  if (showNotifyBadge && inboxCount > 0) {
      badgeSymbolElement = widgetStack.addImage(SFSymbol.named(`${inboxCount}.circle`).image);
      badgeSymbolElement.imageSize = new Size(15, 15)
      badgeSymbolElement.tintColor = Color.red()
    }
  
 if (showUserTitle && userTitle != '') {sbttl = userName + ' - ' + userTitle; spacer = 10;}
 else if (!showUserTitle || userTitle == '') {sbttl = userName; spacer = 70;}
  
  let wSubtitle = rightHeaderStack.addText(sbttl)
  	    wSubtitle.font = Font.regularRoundedSystemFont(12)
      wSubtitle.textColor = txtColor
  
  let leftTextStack = widgetStackL.addStack()
      leftTextStack.layoutVertically()
      leftTextStack.setPadding(5, 5, -5, 0)
  
  let rightImageStack = widgetStack.addStack()
      rightImageStack.layoutVertically()
      rightImageStack.setPadding(25, spacer, 0, 0)
      
      leftTextStack.addSpacer(4);     
      
  let line2 = leftTextStack.addText("Total Karma: " + totalKarma)
      line2.font = Font.lightRoundedSystemFont(13)
      line2.textColor = txtColor
  
  let line3 = leftTextStack.addText("Post Karma: " + postKarma)
      line3.font = Font.lightRoundedSystemFont(13)
      line3.textColor = txtColor
      
  let line4 = leftTextStack.addText("Comment Karma: " + commentKarma)
      line4.font = Font.lightRoundedSystemFont(13)
      line4.textColor = txtColor
  
  let line5 = leftTextStack.addText("Awarder Karma: " + awarderKarma)
      line5.font = Font.lightRoundedSystemFont(13)
      line5.textColor = txtColor
  
  let line6 = leftTextStack.addText("Awardee Karma: " + awardeeKarma)
      line6.font = Font.lightRoundedSystemFont(13)
      line6.textColor = txtColor
  
      uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      line7 = leftTextStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.lightRoundedSystemFont(13)
      line7.textColor = Color.red()
}

  let profileImage = rightImageStack.addImage(await getImageFor(nKey.get("nameProfileImage")))//"profileImage"))      
      profileImage.imageSize = new Size(77, 77)
      profileImage.cornerRadius = cornerRadiusProfileImg
      profileImage.rightAlignImage()
      profileImage.url = urlScheme+profileURL
  
  if (showCoinBalance) {
      coinsStack = rightImageStack.addStack()
      coinsStack.setPadding(2, 15, 2, 0)
      coinsStack.cornerRadius = 5
      coinsImage = coinsStack.addImage(await getImageFor("coins"))
      coinsImage.imageSize = new Size(11, 15)
      coinsStack.addSpacer(5)
      coinsNumber = coinsStack.addText(coinBalance)
      coinsNumber.font = Font.regularRoundedSystemFont(12)  
      coinsNumber.textColor = txtColor
};

      leftTextStack.addSpacer()

      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Widget Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(9)
      footer.textColor = txtColor
      footer.textOpacity = 0.4
      footer.centerAlignText()
 
  return widget
};


//********** CEEATE LARGE WIDGET *********
async function createLargeWidget() {
  let widget = new ListWidget();
  let data = await getFromAPI()
      widget.setPadding(20, 15, 3, 5)
      widget.backgroundGradient = bgGradient
      widget.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
  
      widget.addSpacer()
      
  let imgStack = widget.addStack()
      imgStack.cornerRadius = 10;
      imgStack.imageSize = new Size(25, 25);      
  
  let profileImage = imgStack.addImage(await getImageFor(nKey.get("nameProfileImage")));
      profileImage.imageSize = new Size(88, 88)
      profileImage.cornerRadius = cornerRadiusProfileImg
      profileImage.url = urlScheme+profileURL

      widget.addSpacer(10)
  
  let headerStack = widget.addStack()
  let line1 = widget.addStack()
      line1.centerAlignContent()
      line1.spacing = 3
  let line2 = widget.addStack()
      line2.centerAlignContent()
      line2.spacing = 3
  
  if (showUserTitle && userTitle != '') {
    	 hdrTtl = userTitle
      addText(line1, userName + " ", 13, 0.7)
      addString(line1, await getImageFor('karma'), 0, 13, totalKarma + " karma ", 13, 0.7)
      addString(line1, await getImageFor('coins'), 0, 12, coinBalance + " Coin Balance", 13, 0.7)
      addText(line2, "redditor since " + accountAge + " • " + dateCreated, 13, 0.7)
  } else if (!showUserTitle || userTitle == "") {
    	 hdrTtl = userName
      addString(line1, await getImageFor('karma'), 0, 12, totalKarma + " karma", 13, 0.7)
      addString(line1, await getImageFor('coins'), 0, 10, coinBalance + " Coin Balance", 13, 0.7)
      addText(line2, "redditor since " + accountAge + " • " + dateCreated, 13, 0.7)
  };
  
    let headerTitle = headerStack.addText(hdrTtl)
        headerTitle.font = Font.boldRoundedSystemFont(24)
        headerTitle.textColor = txtColor
        headerTitle.url = profileURL
  
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4)) {
      headerStack.addSpacer(7);
      headerTitleCakeDay = headerStack.addImage(await getImageFor('cakedayApollo'));
      imgStack.backgroundImage = await getImageFor("cakedayConfetti");
      
}

  if (showNotifyBadge && inboxCount > 0) {
      headerStack.addSpacer(3)
      badgeSymbolElement = headerStack.addImage(SFSymbol.named(`${inboxCount}.circle`).image);
      badgeSymbolElement.imageSize = new Size(20, 20)
      badgeSymbolElement.tintColor = Color.red()
    }

      widget.addSpacer(3)
      
  let headerDescription = widget.addText(puplicDescription)
      headerDescription.font = Font.lightRoundedSystemFont(13)  
      headerDescription.textColor = txtColor
      headerDescription.textOpacity = 0.7
      headerDescription.lineLimit = 1
      headerDescription.minimumScaleFactor = 0.9
   
      widget.addSpacer()
  
  let mainBodyStack = widget.addStack()
      mainBodyStack.layoutVertically()
  
  let line3 = mainBodyStack.addText("Post Karma: " + postKarma)
      line3.font = Font.lightRoundedSystemFont(17)
      line3.textColor = txtColor
  
  let line4 = mainBodyStack.addText("Comment Karma: " + commentKarma)
      line4.font = Font.lightRoundedSystemFont(17)
      line4.textColor = txtColor
  
  let line5 = mainBodyStack.addText("Awarder Karma: " + awarderKarma)
      line5.font = Font.lightRoundedSystemFont(17)
      line5.textColor = txtColor
  
  let line6 = mainBodyStack.addText("Awardee Karma: " + awardeeKarma)
      line6.font = Font.lightRoundedSystemFont(17)
      line6.textColor = txtColor
      
  let uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      line7 = mainBodyStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.lightSystemFont(17)
      line7.textColor = Color.red()
};
  
      widget.addSpacer();
  
      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Widget Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(11)
      footer.textColor = txtColor
      footer.textOpacity = 0.3
      footer.centerAlignText();
  
  return widget
};

// creating error widget (first run or no datas saved)
async function createErrorWidget(padding, radius, size1, size2) {
  let errWidget = new ListWidget();
      errWidget.url = "scriptable:///run/Reddit%20Widget"
      errWidget.refreshAfterDate = new Date(Date.now() + 1000*60* refreshInt)
      errWidget.setPadding(padding, padding, padding, padding)
      errWidget.backgroundGradient = bgGradient;
      
      errWidget.addText("Couldn’t find login datas - Looks like your first run").font = Font.boldMonospacedSystemFont(size1);
  
      errWidget.addSpacer();
     
      errWidget.addText("Please open the script and enter your login datas or visit").font = Font.regularMonospacedSystemFont(size2);
  
      errWidget.addSpacer();
  
  let linkButton = errWidget.addStack();
      linkButton.setPadding(7, 0, 7, 0);
      linkButton.backgroundColor = Color.white();
      linkButton.cornerRadius = radius
      linkButton.centerAlignContent();
      linkButton.url = 'https://github.com/iamrbn/Reddit-Widget/';
  
      linkButton.addSpacer();

  let wURL = linkButton.addText("GitHub Repo ↗");
      wURL.font = Font.semiboldMonospacedSystemFont(size2);
      wURL.textColor = Color.blue();
      wURL.centerAlignText();
      
      linkButton.addSpacer();
      
  return errWidget;
};


//==========================================
//========== START FUNCTION AREA ===========
//==========================================

// sends request to reddit-api
async function getFromAPI() {
let user;
try {
    await fm.downloadFileFromiCloud(jsonPath);
    user = await JSON.parse(fm.readString(jsonPath));

let data;
try {
// Get Access-Token for json api request
let reqToken = new Request('https://www.reddit.com/api/v1/access_token')
    reqToken.method = 'POST'
    reqToken.headers = {'Authorization': 'Basic ' + btoa(user.CLIENT_ID + ":" + user.CLIENT_SECRET)}
    reqToken.body = `grant_type=password&username=${user.USERNAME}&password=${user.PASSWORD}`

    token = await reqToken.loadJSON();
    //console.warn(JSON.stringify(resToken, null, 1))

// Get user-profile json from api/v1/me
let reqDatas = new Request('https://oauth.reddit.com/api/v1/me')
    reqDatas.headers = {
    'User-Agent': 'getKarmaFromRedditBy-iamrbn/v1.1',
    'Authorization': `${token.token_type} ${token.access_token}`
    };

    data = await reqDatas.loadJSON();
    //console.log(JSON.stringify(data, null, 1));
    
    var arr = [data.total_karma, data.link_karma, data.comment_karma, data.awarder_karma, data.awardee_karma, data.coins];
        arr.forEach((item, index) => {
        arr[index] = Intl.NumberFormat('en-US', {notation:'compact', maximumSignificantDigits: 5}).format(item)
});

 //Declare variables
 totalKarma = arr[0];
 postKarma = arr[1];
 commentKarma = arr[2];
 awarderKarma = arr[3];
 awardeeKarma = arr[4];
 coinBalance = arr[5];
 profileImg = data.icon_img.split('?');
 snoovatarImg = data.snoovatar_img //full view of profile image
 bannerImg = data.subreddit.banner_img.split('?');
 userTitle = data.subreddit.title
 userName = data.subreddit.display_name_prefixed
 puplicDescription = data.subreddit.public_description
 inboxCount = data.inbox_count //post inbox
 profileURL = "://reddit.com"+data.subreddit.url.slice(0, -1);
 dateCreated = df.string(new Date(data.created*1000))//date of creating account
 minutesDiff = Math.floor((new Date(Date.now()).getTime() - new Date(data.created * 1000).getTime()) / 1000 / 60);
 accountAge = (minutesDiff < 525600) ? Math.abs(minutesDiff/60/24).toFixed(0)+" d" : Math.abs(minutesDiff/60/24/365).toFixed(1)+" y";
  } catch {}
    } catch (e) {logError(e)}
};

function addString(stack, image, radius, size, text, txtSize, txtOpacity) {
  let wImg = stack.addImage(image)
      wImg.cornerRadius = radius
      wImg.imageSize = new Size(size, size);
      
  let wTxt = stack.addText(text)
      wTxt.font = Font.lightRoundedSystemFont(txtSize)
      wTxt.textColor = txtColor
      wTxt.textOpacity = txtOpacity
};

function addText(stack, text, size, opacity) {
  let wTxt = stack.addText(text)
      wTxt.font = Font.lightRoundedSystemFont(size)
      wTxt.textColor = txtColor
      wTxt.textOpacity = opacity
};

// Save images from github and web
async function saveAllImages() {
  let imgURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Images/';
  console.log("loading & saving images");
  var imgs = ["karma.png", "coins.png", "cakedayConfetti.png", "cakedayApollo.png", "coins2.png", "cakedayReddit.png"];
  for (img of imgs) {
      imgPath = fm.joinPath(dir, img);
      if (!fm.fileExists(imgPath)) {
      logWarning("Loading image: " + img);
      request = new Request(imgURL + img);
      image = await request.loadImage();
      fm.writeImage(imgPath, image);
    }
  };

  for (appIcon in appIcons) {
   iconName = appIcon + ".png"
   imgPath = fm.joinPath(dir, iconName);
   log("success, " + iconName + " already exists in iCloud")
    if (!fm.fileExists(imgPath)) {
      logWarning("loading image: " + iconName);
      req = new Request(appIcons[appIcon]);
      img = await req.loadImage();
      fm.writeImage(imgPath, img);
    }
  };

  imgName = String(profileImg[0].match(/profile.*-/)).slice(0, -1);
  if (!nKey.contains("nameProfileImage")) nKey.set("nameProfileImage", imgName);
  if (nKey.get("nameProfileImage") != imgName) await profileImageChecker();
  
async function profileImageChecker() {
  let imgPath = fm.joinPath(dir, nKey.get("nameProfileImage")+'.png');
  
  let alert = new Alert();
      alert.title = "Looks Like you’ve changed your Snoovatar";
      alert.message = "Do you want to change it in the widget, too?\nNo, means you have to delete it manually via 'Delete Menu ⌦'";
      alert.addAction("Yes");
      alert.addCancelAction("Nope, I'll do it later on my own");
      let idx = await alert.present();
      if (idx == 0) {
         fm.remove(imgPath);
         await deleteMessage(fm.fileName(imgPath, true));
    } else if (idx == -1) await presentMenu();
    nKey.set("nameProfileImage", imgName);
  };
  
  imgPath = fm.joinPath(dir, imgName + '.png');
  imgFileName = fm.fileName(imgPath, true);
  if (!fm.fileExists(imgPath)) {
    logWarning("loading & saving profile Image");
    req = new Request(profileImg[0]);
    image = await req.loadImage();
    fm.writeImage(imgPath, image);
    }
};


// get image from icloud ~iCloud/Scriptable/Reddit-Widget
async function getImageFor(name) {
  imgPath = fm.joinPath(dir, name + ".png")
  await fm.downloadFileFromiCloud(imgPath)
  img = await fm.readImage(imgPath)
 return img;
};

//Delete Menu
async function deleteUserDatas() {
 let alert = new Alert()
     alert.title = "Are You Sure to Delete Your Datas?"
     alert.message = "Removed files can NOT be restored"
     alert.addAction("Profile Image");
     alert.addAction("Login Datas");
     alert.addAction("Both Of Them");
     alert.addDestructiveAction("Complete 'Reddit-Widget' Folder");
     alert.addCancelAction("Cancel");
     let idx = await alert.present();
     if (idx == 0) {fm.remove(dir+'/'+nKey.get("nameProfileImage")+'.png'); await deleteMessage(fm.fileName(dir+'/'+nKey.get("nameProfileImage")+'.png', true))}
     else if (idx == 1) {fm.remove(jsonPath); await deleteMessage(fm.fileName(jsonPath, true)); throw new Error('User Deleted Login Datas');}
     else if (idx == 2) {fm.remove(jsonPath); fm.remove(dir+'/'+nKey.get("nameProfileImage")+'.png'); await deleteMessage(fm.fileName(jsonPath, true)+'\n'+fm.fileName(dir+'/'+nKey.get("nameProfileImage")+'.png', true)); throw new Error('User Deleted Profile Image & LoginDatas')}
     else if (idx == 3) await scndAlert();
     else if (idx == -1) await presentMenu();
  };
async function scndAlert() {
    filesList = fm.listContents(dir).toString().replaceAll(",", "\n").replaceAll(".icloud", "").replaceAll(/^[.]/gm, '');
    logWarning(filesList);
    scndAlrt = new Alert();
    scndAlrt.title = "Are You Really Sure?"
    scndAlrt.message = "Removed files can NOT be restored\n\n" + filesList
    scndAlrt.addDestructiveAction("Yes, Delete Everything!");
    scndAlrt.addCancelAction("Nope, I'm Out");
    let idx = await scndAlrt.present();
    if (idx == 0) {fm.remove(dir); await deleteMessage('Folder: ' + fm.fileName(dir, true))}
    else if (idx == -1) await presentMenu();
   };
  async function deleteMessage(message) {
    fnlAlert = new Alert();
    fnlAlert.title = "Deleted Sucessfully"
    fnlAlert.message = message
    fnlAlert.addAction("OK");
    await fnlAlert.presentAlert();
};

//Asks for user login datas to save in iCloud ~ iCloud/Scriptable/Reddit-Widget
async function askForLoginDatas() {
  let alert = new Alert()
      alert.title = "No Datas Found!\nEnter Login Datas"
      alert.message = "~ iCloud/Scriptable/Reddit-Widget/LoginDatas.json"
      alert.addTextField('Username (without "u/")')
      alert.addTextField("Password")
      alert.addTextField("Client ID")
      alert.addTextField("Client Secret");
      alert.addAction("Done")
      alert.addDestructiveAction("Cancel")
      alert.addAction("Documentation ↗")
  let idx = await alert.present();
  if (idx == 0) {
     userDatas = {
       USERNAME: alert.textFieldValue(0),
       PASSWORD: alert.textFieldValue(1),
       CLIENT_ID: alert.textFieldValue(2),
       CLIENT_SECRET: alert.textFieldValue(3)};
     checkObj = Object.values(userDatas).every(value => value !== "" && value.length > 3);
     if (checkObj) fm.writeString(jsonPath, JSON.stringify(userDatas, null, 1));
     else await askForLoginDatas();
} else if (idx == 1) throw new Error('User Clicked "Cancel"');
  else if (idx == 2) Safari.openInApp('https://github.com/iamrbn/Reddit-Widget/#create-personal-reddit-appscript', false);
};

// creating menu for start script
async function presentMenu() {
  let alert = new Alert();
      alert.title = userName
      alert.message = `Total Karma: ${totalKarma}\nCoin Balance: ${coinBalance}\nUnread Inbox: ${inboxCount}`
      alert.addAction("Small")
      alert.addAction("Medium")
      alert.addAction("Large")
      alert.addAction("Open Profile ↗")
      alert.addDestructiveAction("Delete Menu ⌦")
      alert.addCancelAction("Cancel")
  let idx = await alert.presentSheet()
  if (idx == 0) {
    widget = await createSmallWidget()
    await widget.presentSmall()
  } else if (idx == 1) {
    widget = await createMediumWidget()
    await widget.presentMedium()
  } else if (idx == 2) {
    widget = await createLargeWidget()
    await widget.presentLarge()
  } else if (idx == 3) Safari.open(urlScheme+profileURL);
    else if (idx == 4) await deleteUserDatas();
};

//checks if's there an server update available
async function updateCheck(version) {
  let uC;
 try {
  let updateCheck = new Request(`${scriptURL}on`)
      uC = await updateCheck.loadJSON()
 } catch (e) {return logWarning(e)}
  
  log(uC)
  
  let needUpdate = false
  if (uC.version != version) {
      needUpdate = true
      console.warn(`Server Version ${uC.version} Available!`)
    if (!config.runsInWidget) {
      let newAlert = new Alert();
          newAlert.title = `Server Version ${uC.version} Available!`
          newAlert.message="Changes:\n" + uC.notes + "\n\nPress OK to get the update from GitHub"
          newAlert.addAction("OK");
          newAlert.addDestructiveAction("Later");
      if (await newAlert.present() == 0) {
        let req = new Request(scriptURL)
        let updatedCode = await req.loadString()
        //let fm = FileManager.iCloud()
        let path = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        log(path)
        fm.writeString(path, updatedCode)
        throw new Error("Update Complete!")
      }
    }
  } else {log("script is already up to date")}

  return needUpdate, uC;
};

//=======================================\\
//============ END OF SCRIPT ============\\
//=======================================\\


