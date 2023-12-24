// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: robot;
// Variables used by Scriptable.
// Created by - iamrbn 
// Script URL: https://github.com/iamrbn/Reddit-Widget

// ===========================================
// ========== START CONFIG ZONE ==============

//shortcut to get app-icon-urls from app-store: https://routinehub.co/shortcut/11635/
const appStoreIcons = {
reddit: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/90/cb/74/90cb74af-55b2-f44e-8e15-0555c7b8beee/AppIcon-0-0-1x_U007epad-0-0-85-220.png/512x512bb.png',
apollo:'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a1/d8/a6/a1d8a63c-1534-2a04-b0fe-3de6e9c800b9/AppIcon-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-85-220.png/512x512bb.png'
}

const refreshInt = 90 //in minutes
const enableNotifications = true //beta
const showNotifyBadge = true //all widget sizes
const showUserTitle = true //medium- & large widget
const numberFormatting = 'de-DE' //For karma valuesen. e.g.: en-EN, en-IN etc.
const widgetIcon = 'oldReddit' //small- & medium widget; available icons: alienblue, black, classic, orange, roundorange, oldReddit, reddit, apollo;

// =========== END CONFIG ZONE ================
//=============================================

let scriptURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Reddit-Widget.js'
let scriptVersion = '1.4'
let df = new DateFormatter()
    df.dateFormat = 'MMMM dd, yyyy'
let widgetSize = config.widgetFamily
let fm = FileManager.iCloud()
let nKey = Keychain
//log(nKey.get("nameProfileImage"))
//nKey.remove("nameProfileImage")
let nParameter = await args.notification
let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
let txtBGColor = Color.dynamic(new Color('#D5D7DCA6'), new Color('#242424A6'))
let txtColor = Color.dynamic(Color.black(), Color.white())
//Standard dynamic colors for background gradient
let top = Color.dynamic(new Color('#ffffff'), new Color('#0F2D60'))
let middle = Color.dynamic(new Color('#EDEDED'), new Color('#000427'))
let bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#000000'))
/*
//Orange background gradient like the official reddit app icon
let top = new Color('#FF8420')
let middle = new Color('#FD3F12')
let bottom = new Color('#EA2128')
*/
let bgGradient = new LinearGradient()
    bgGradient.locations = [0, 0.7, 1]
    bgGradient.colors = [top, middle, bottom]
    
if (config.runsInApp && fm.fileExists(jsonPath)) {
   await getFromAPI()
   await saveAllImages()
   await presentMenu()
} else if (config.runsInApp && !fm.fileExists(jsonPath)) {
   await askForLoginDatas()
   await getFromAPI()
   await saveAllImages()
   await presentMenu()
};

if (config.runsInWidget || config.runsInAccessoryWidget) {
  switch (widgetSize) {
    case 'accessoryCircular': widget = await createCircular(); break;
    //case 'accessoryRectangular':widgetw = await createRectangular(); break;
    case "small":
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(12, 13, 12, 11)
     else widget = await createSmallWidget()
    break;
    case "medium":
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(14, 17, 16, 16)
     else widget = await createMediumWidget()
    break;
    case "large":
     if (!fm.fileExists(jsonPath) || !nKey.contains("nameProfileImage")) widget = await createErrorWidget(25, 19, 22, 20)
     else widget = await createLargeWidget()
    break;
    default: widget = await createErrorWidget();
  }
  Script.setWidget(widget)
} else if (config.runsInNotification) QuickLook.present(await getImageFor(nParameter.userInfo.img))

// ******* CIRCULAR LS WIDGET ********
async function createCircular(){
 let data = await getFromAPI()
 let widget = new ListWidget()
 widget.url = profileURL
 widget.refreshAfterDate = new Date(Date.now() + 1000*60* 1)
 widget.addAccessoryWidgetBackground = true
 
 let img = widget.addImage(await getImageFor("arrowsLS"))
     img.imageSize = new Size(40, 20)
     img.centerAlignImage()
   
 widget.addSpacer(5)

 let total_Karma = widget.addText(totalKarma)
     total_Karma.textColor = Color.white()
     total_Karma.font = Font.boldRoundedSystemFont(13)
     total_Karma.centerAlignText()

 let uCheck = await updateCheck(scriptVersion)
 if (uCheck.version > scriptVersion){}

return widget
}

/*
// ****** RECTANGULAR LS WIDGET *******
async function createRectangular(){
 let data = await getFromAPI()
 let widget = new ListWidget()
 widget.url = profileURL
 widget.refreshAfterDate = new Date(Date.now() + 1000*60* refreshInt)

 let uCheck = await updateCheck(scriptVersion)

return widget
}
*/

// ******** SMALL WIDGET *********
async function createSmallWidget() {
  let data = await getFromAPI()
  let widget = new ListWidget()
      widget.setPadding(7, 6, 2, 6)
      widget.url = profileURL
      widget.refreshAfterDate = new Date(Date.now() + 1000*60* refreshInt)
      
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


  let appIconElement = leftHeaderStackL.addImage(await getImageFor(widgetIcon))
      appIconElement.imageSize = new Size(30, 30)
      appIconElement.cornerRadius = 15
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
  let badgeSymbolElement = rightHeaderStackR.addImage(SFSymbol.named(`${inboxCount}.circle`).image)
      badgeSymbolElement.imageSize = new Size(15, 15)
      badgeSymbolElement.tintColor = Color.red()
    };

      widget.addSpacer(3)
  
  let mainStack = widget.addStack()
      mainStack.backgroundColor = txtBGColor
      mainStack.layoutVertically()
      mainStack.cornerRadius = 11
      mainStack.setPadding(7, 5, 7, 1)
      mainStack.centerAlignContent()

  let lineOneStack = mainStack.addStack()
      lineOneStack.centerAlignContent()
      lineOneStack.spacing = 4
      
      addString(lineOneStack, await getImageFor('karma'), 0, 14, totalKarma, 11, 1.0)
      addText(lineOneStack, ' | ', 11, 0.4)
      addString(lineOneStack, await getImageFor('cakedayApollo'), 0, 14, accountAge, 11, 1.0)
      
      mainStack.addSpacer(4)
      lineOneStack.addSpacer()
  
  let line3 = mainStack.addText("Post: " + postKarma)
      line3.font = Font.regularRoundedSystemFont(11)
      line3.textColor = txtColor
  
  let line4 = mainStack.addText("Comment: " + commentKarma)
      line4.font = Font.regularRoundedSystemFont(11)
      line4.textColor = txtColor
  
  let line5 = mainStack.addText("Awarder: " + awarderKarma)
      line5.font = Font.regularRoundedSystemFont(11)
      line5.textColor = txtColor
  
  let line6 = mainStack.addText("Awardee: " + awardeeKarma)
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
}


//********** MEDIUM WIDGET *********
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
      mainHeaderStackLeft.url = profileURL
      mainHeaderStackLeft.centerAlignContent()
  
  let leftHeaderStack = mainHeaderStackLeft.addStack()
      leftHeaderStack.layoutVertically()
  
  let rightHeaderStack = mainHeaderStackLeft.addStack()
      rightHeaderStack.layoutVertically()
      rightHeaderStack.setPadding(0, 5, 0, 0)
  
  
  let appIconElement = leftHeaderStack.addImage(await getImageFor(widgetIcon))
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

  let profileImage = rightImageStack.addImage(await getImageFor(nKey.get("nameProfileImage")))     
      profileImage.imageSize = new Size(77, 77)
      profileImage.rightAlignImage()
      profileImage.url = profileURL
      
      rightImageStack.addSpacer(5)
    
      createdStack = rightImageStack.addStack()
      createdStack.addSpacer(15)
      createdStack.setPadding(-1.5, 0, -1.5, 0)
      //createdStack.backgroundColor = Color.green()
      cdImage = createdStack.addImage(await getImageFor('cakedayApollo'))
      cdImage.imageSize = new Size(17, 17)
      createdStack.addSpacer(2)
      cdString = createdStack.addText(accountAge)
      cdString.font = Font.regularRoundedSystemFont(12)  
      cdString.textColor = txtColor
      createdStack.addSpacer(5)

      leftTextStack.addSpacer()

      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(9)
      footer.textColor = txtColor
      footer.textOpacity = 0.4
      footer.centerAlignText()
 
  return widget
};


//********** LARGE WIDGET *********
async function createLargeWidget() {
  let widget = new ListWidget()
  let data = await getFromAPI()
      widget.setPadding(10, 15, 3, 5)
      widget.backgroundGradient = bgGradient
      widget.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
  
      //widget.addSpacer()
  let bodyStack = widget.addStack()
      bodyStack.layoutVertically()
      //bodyStack.backgroundColor = Color.cyan()
    
  let iconStack = bodyStack.addStack()
      iconStack.addSpacer()
  let iconImage = iconStack.addImage(await getImageFor(widgetIcon))
      iconImage.cornerRadius = 7
      iconImage.imageSize = new Size(22, 22)
      iconImage.url = profileURL
      iconStack.addSpacer(5)
      bodyStack.addSpacer(20)
    
  let imgStack = bodyStack.addStack()
      //imgStack.cornerRadius = 10
      //imgStack.imageSize = new Size(30, 30)
      //imgStack.backgroundColor = Color.white()
  
  let profileImage = imgStack.addImage(await getImageFor(nKey.get("nameProfileImage")));
      profileImage.imageSize = new Size(80, 80)
      profileImage.url = profileURL
      imgStack.addSpacer()
      //widget.addSpacer(1)
  
  let headerStack = bodyStack.addStack()
      //headerStack.backgroundColor = Color.purple()
      headerStack.setPadding(0, 0, 4, 0)
  let line1 = bodyStack.addStack()
      line1.centerAlignContent()
      line1.spacing = 3
      //line1.backgroundColor = Color.magenta()
  let line2 = bodyStack.addStack()
      line2.centerAlignContent()
      line2.spacing = 3
      //line2.backgroundColor = Color.blue()
  let line3 = bodyStack.addStack()
      line3.centerAlignContent()
      line3.spacing = 3
      //line3.backgroundColor = Color.yellow()
    
  if (showUserTitle && userTitle != '') {
    	 hdrTtl = userTitle
      addText(line1, userName + " ", 16, 0.7)
      addString(line1, await getImageFor('karma'), 0, 15, totalKarma + " Total Karma", 15, 0.9)
      addString(line2, await getImageFor('cakedayApollo'), 0, 15, dateCreated + " • " + "redditor since " + accountAge, 15, 0.9)
  } else if (!showUserTitle || userTitle == "") {
    	 hdrTtl = userName
      addString(line1, await getImageFor('karma'), 0, 15, totalKarma + " Total Karma", 15, 0.9)
      addString(line2, await getImageFor('cakedayApollo'), 0, 15, dateCreated + " • " + "redditor since " + accountAge, 15, 0.9)
  };
  
    let headerTitle = headerStack.addText(hdrTtl)
        headerTitle.font = Font.boldRoundedSystemFont(24)
        headerTitle.textColor = txtColor
        headerTitle.url = profileURL
  
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4)) {
      headerStack.addSpacer(7);
      headerTitleCakeDay = headerStack.addImage(await getImageFor('cakedayApollo'))
      imgStack.backgroundImage = await getImageFor("cakedayConfetti")
}
  var inboxCount = 3
  if (showNotifyBadge && inboxCount > 0) {
      headerStack.addSpacer(3)
      badgeSymbolElement = headerStack.addImage(SFSymbol.named(`${inboxCount}.circle`).image)
      badgeSymbolElement.imageSize = new Size(20, 20)
      badgeSymbolElement.tintColor = Color.red()
    }

      bodyStack.addSpacer(7)
      
  let headerDescription = line3.addText(puplicDescription)
      headerDescription.font = Font.lightRoundedSystemFont(16)  
      headerDescription.textColor = txtColor
      headerDescription.textOpacity = 0.8
      headerDescription.lineLimit = 1
      headerDescription.minimumScaleFactor = 0.5
   
      bodyStack.addSpacer(10)
  
  let mainBodyStack = bodyStack.addStack()
      mainBodyStack.layoutVertically()
      //mainBodyStack.backgroundColor = Color.green()
  
  let line4 = mainBodyStack.addText("Post Karma: " + postKarma)
      line4.font = Font.lightRoundedSystemFont(17)
      line4.textColor = txtColor
  
  let line5 = mainBodyStack.addText("Comment Karma: " + commentKarma)
      line5.font = Font.lightRoundedSystemFont(17)
      line5.textColor = txtColor
  
  let line6 = mainBodyStack.addText("Awarder Karma: " + awarderKarma)
      line6.font = Font.lightRoundedSystemFont(17)
      line6.textColor = txtColor
  
  let line7 = mainBodyStack.addText("Awardee Karma: " + awardeeKarma)
      line7.font = Font.lightRoundedSystemFont(17)
      line7.textColor = txtColor
      
  let uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      line8 = mainBodyStack.addText(`Update ${uCheck.version} Available!`)
      line8.font = Font.lightSystemFont(17)
      line8.textColor = Color.red()
}
      bodyStack.addSpacer()
      //widget.addSpacer(10)
  
      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(11)
      footer.textColor = txtColor
      footer.textOpacity = 0.5
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

// sends request to reddit-api
async function getFromAPI(){
let user;
try {
    await fm.downloadFileFromiCloud(jsonPath)
    user = await JSON.parse(fm.readString(jsonPath))

let data;
try {
// Get Access-Token for json api request
let reqToken = new Request('https://www.reddit.com/api/v1/access_token')
    reqToken.method = 'POST'
    reqToken.headers = {'Authorization': 'Basic ' + btoa(user.CLIENT_ID + ":" + user.CLIENT_SECRET)}
    reqToken.body = `grant_type=password&username=${user.USERNAME}&password=${user.PASSWORD}`

    token = await reqToken.loadJSON()
    //console.warn(JSON.stringify(resToken, null, 1))

// Get user-profile json from api/v1/me
let reqDatas = new Request('https://oauth.reddit.com/api/v1/me')
    reqDatas.headers = {
    'User-Agent': 'getKarmaFromRedditBy-iamrbn/v1.1',
    'Authorization': `${token.token_type} ${token.access_token}`
    };

    data = await reqDatas.loadJSON()
    //console.log(JSON.stringify(data, null, 1))

 //Declare variables
 totalKarma = Intl.NumberFormat('en-EN', {notation:'compact', maximumSignificantDigits: 2}).format(data.total_karma)
 postKarma = Intl.NumberFormat(numberFormatting).format(data.link_karma)
 commentKarma = Intl.NumberFormat(numberFormatting).format(data.comment_karma)
 awarderKarma = Intl.NumberFormat(numberFormatting).format(data.awarder_karma)
 awardeeKarma = Intl.NumberFormat(numberFormatting).format(data.awardee_karma)
 profileImg = data.icon_img.split('?')
 snoovatarImg = data.snoovatar_img //full view of profile image
 userTitle = data.subreddit.title
 userName = data.subreddit.display_name_prefixed
 puplicDescription = data.subreddit.public_description
 inboxCount = data.inbox_count //post inbox
 profileURL = "https://reddit.com"+data.subreddit.url.slice(0, -1)
 dateCreated = df.string(new Date(data.created*1000))//date of creating account
 minutesDiff = Math.floor((new Date(Date.now()).getTime() - new Date(data.created * 1000).getTime()) / 1000 / 60)
 accountAge = (minutesDiff < 525600) ? Math.abs(minutesDiff/60/24).toFixed(0)+" d" : Math.abs(minutesDiff/60/24/365).toFixed(1)+" y"
//console.log({profileImg})
if (!nKey.contains("current_total_karma")) nKey.set("current_total_karma", data.total_karma)
if (!nKey.contains("cakeday")) nKey.set("cakeday", dateCreated.slice(0, -4))
let karmaDiffNmbr = data.total_karma - nKey.get("current_total_karma")
//if (karmaDiffNmbr >= 25) notifier(data, '25 more upvotes wuhuu!', data.total_karma+'k', 'karma');
//if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4))) notifier(data, 'Huhu 👋', 'today is your cakeday', 'cakedayApollo');
await notifier(data, 'Ahoi 👋', 'today is your cakeday', 'cakedayApollo')
await notifier('25 more upvotes wuhuu!', totalKarma, 'karma')

}catch(error){console.log("543:\n"+error)}
    }catch(error){console.log("544:\n"+error)}
}

function addString(stack, image, radius, size, text, txtSize, txtOpacity){
  let wImg = stack.addImage(image)
      wImg.cornerRadius = radius
      wImg.imageSize = new Size(size, size)
  stack.addSpacer(0.5)   
  let wTxt = stack.addText(text)
      wTxt.font = Font.lightRoundedSystemFont(txtSize)
      wTxt.textColor = txtColor
      wTxt.textOpacity = txtOpacity
}

function addText(stack, text, size, opacity){
  let wTxt = stack.addText(text)
      wTxt.font = Font.lightRoundedSystemFont(size)
      wTxt.textColor = txtColor
      wTxt.textOpacity = opacity
}

function notifier(dt, title, subtitle, imgName){
  let n = new Notification()
      n.title = title//'25 more upvotes wuhuu '
      n.subtitle = subtitle//data.total_karma + 'k';
      n.identifier = subtitle//totalKarma
      n.userInfo = {img:imgName}
      n.addAction('Open Profile ↗', urlScheme+profileURL)
      n.scriptName = Script.name()
      n.threadIdentifier = Script.name()
      n.preferredContentHeight = 77
      n.schedule()
      
  nKey.set("current_total_karma", dt.total_karma)
  //nKey.set("cakeday", "0")
}

// Save images from github and appstore
async function saveAllImages(){
  let imgURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Images/'
  let imgs = ["karma.png", "cakedayConfetti.png", "cakedayApollo.png", "cakedayReddit.png", "alienblue.png", "black.png", "classic.png", "orange.png", "roundorange.png", "oldReddit.png"]
  for (img of imgs){
      imgPath = fm.joinPath(dir, img)
      if (!fm.fileExists(imgPath)){
      console.warn("Loading image: " + img)
      request = new Request(imgURL + img)
      image = await request.loadImage()
      fm.writeImage(imgPath, image)
    }
  }

  for (appIcon in appStoreIcons) {
   iconName = appIcon + ".png"
   imgPath = fm.joinPath(dir, iconName)
   //console.log(iconName + " already exists in iCloud")
    if (!fm.fileExists(imgPath)) {
      console.warn("loading image: " + iconName)
      req = new Request(appStoreIcons[appIcon])
      img = await req.loadImage()
      fm.writeImage(imgPath, img)
    }
  }

  imgName = String(profileImg[0].match(/profile.*-/)).slice(0, -1);
  if (!nKey.contains("nameProfileImage")) nKey.set("nameProfileImage", imgName);
  if (nKey.get("nameProfileImage") != imgName) await profileImageChecker();
  
async function profileImageChecker() {
  let imgPath = fm.joinPath(dir, nKey.get("nameProfileImage")+'.png')
  
  let alert = new Alert()
      alert.title = "Looks Like you’ve changed your Snoovatar"
      alert.message = "Do you want to change it in the widget, too?\nNo, means you have to delete it manually via 'Delete Menu ⌦'";
      alert.addAction("Yes")
      alert.addCancelAction("Nope, I'll do it later on my own")
      let idx = await alert.present();
      if (idx == 0) {
         fm.remove(imgPath)
         await deleteMessage(fm.fileName(imgPath, true))
    } else if (idx == -1) await presentMenu()
    nKey.set("nameProfileImage", imgName)
  };
  
  imgPath = fm.joinPath(dir, imgName + '.png')
  imgFileName = fm.fileName(imgPath, true);
  if (!fm.fileExists(imgPath)) {
    logWarning("loading & saving profile Image")
    req = new Request(profileImg[0])
    image = await req.loadImage()
    fm.writeImage(imgPath, image)
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
     alert.addAction("Profile Image")
     alert.addAction("Login Datas")
     alert.addAction("Both Of Them")
     alert.addDestructiveAction("Complete 'Reddit-Widget' Folder")
     alert.addCancelAction("Cancel")
     let idx = await alert.present()
     if (idx == 0) {fm.remove(dir+'/'+nKey.get("nameProfileImage")+'.png'); await deleteMessage(fm.fileName(dir+'/'+nKey.get("nameProfileImage")+'.png', true))}
     else if (idx == 1) {fm.remove(jsonPath); await deleteMessage(fm.fileName(jsonPath, true)); throw new Error('User Deleted Login Datas')}
     else if (idx == 2) {fm.remove(jsonPath); fm.remove(dir+'/'+nKey.get("nameProfileImage")+'.png'); await deleteMessage(fm.fileName(jsonPath, true)+'\n'+fm.fileName(dir+'/'+nKey.get("nameProfileImage")+'.png', true)); throw new Error('User Deleted Profile Image & LoginDatas')}
     else if (idx == 3) await scndAlert()
     else if (idx == -1) await presentMenu()
  };
async function scndAlert() {
    filesList = fm.listContents(dir).toString().replaceAll(",", "\n").replaceAll(".icloud", "").replaceAll(/^[.]/gm, '');
    logWarning(filesList)
    scndAlrt = new Alert()
    scndAlrt.title = "Are You Really Sure?"
    scndAlrt.message = "Removed files can NOT be restored\n\n" + filesList
    scndAlrt.addDestructiveAction("Yes, Delete Everything!");
    scndAlrt.addCancelAction("Nope, I'm Out")
    let idx = await scndAlrt.present()
    if (idx == 0) {fm.remove(dir+'/'+nKey.get("nameProfileImage")+'.png'); await deleteMessage(fm.fileName(dir+'/'+nKey.get("nameProfileImage")+'.png', true))}
    else if (idx == -1) await presentMenu()
   };
  async function deleteMessage(message) {
    fnlAlert = new Alert()
    fnlAlert.title = "Deleted Sucessfully"
    fnlAlert.message = message
    fnlAlert.addAction("OK")
    await fnlAlert.presentAlert()
};

//Asks for user login datas to save in iCloud ~ iCloud/Scriptable/Reddit-Widget
async function askForLoginDatas() {
  let alert = new Alert()
      alert.title = "No Datas Found!\nEnter Login Datas"
      alert.message = "~ iCloud/Scriptable/Reddit-Widget/LoginDatas.json"
      alert.addTextField('Username (without "u/")')
      alert.addTextField("Password")
      alert.addTextField("Client ID")
      alert.addTextField("Client Secret")
      alert.addAction("Done")
      alert.addDestructiveAction("Cancel")
      alert.addAction("Documentation ↗")
  let idx = await alert.present()
  if (idx == 0) {
     userDatas = {
       USERNAME: alert.textFieldValue(0),
       PASSWORD: alert.textFieldValue(1),
       CLIENT_ID: alert.textFieldValue(2),
       CLIENT_SECRET: alert.textFieldValue(3)}
     checkObj = Object.values(userDatas).every(value => value !== "" && value.length > 3)
     if (checkObj) fm.writeString(jsonPath, JSON.stringify(userDatas, null, 1))
     else await askForLoginDatas()
} else if (idx == 1) throw new Error('User Clicked "Cancel"')
  else if (idx == 2) Safari.openInApp('https://github.com/iamrbn/Reddit-Widget/#create-personal-reddit-appscript', false);
}

// creating menu for start script
async function presentMenu() {
  let alert = new Alert()
      alert.title = userName
      alert.message = `Total Karma: ${totalKarma}\nUnread Inbox: ${inboxCount}`
      alert.addAction("Small")
      alert.addAction("Medium")
      alert.addAction("Large")
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
  } else if (idx == 4) await deleteUserDatas()
}

//checks if's there an server update available
async function updateCheck(version) {
  let uC;
 try {
  let updateCheck = new Request(`${scriptURL}on`)
      uC = await updateCheck.loadJSON()
 } catch(e){return console.warn(e)}
  
  var needUpdate = false
  if (uC.version > version){
      needUpdate = true
      console.warn(`Server Version ${uC.version} Available!`)
      console.log(uC)
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
        console.log(path)
        fm.writeString(path, updatedCode)
        throw new Error("Update Complete!")
      }
    }
  } else {console.log("SCRIPT IS UP TO DATE")}

  return needUpdate, uC;
}

//============ END OF SCRIPT ============\\
//=======================================\\

