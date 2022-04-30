// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: robot;
//Created by me - iamrbn 
//Script URL: https://github.com/iamrbn/Reddit-Widget

// =========== CONFIG ===========
const USERNAME = 'xyz-1234'//without 'u/'
const PASSWORD = 'xyz-1234'

const CLIENT_ID = 'xyz-1234'
const CLIENT_SECRET = 'xyz-1234'

const showNotifyBadge = true //smallwidget
const showCoinBalance = true //smallwidget, mediumwidget
const showCakedayConfetti = true //smallwidget, mediumwidget
const showUserTitle = true //mediumwidget, largewidget
const cornerRadiusProfileImg = 0 //Set this to +50 for a rounded Image
const standardRedditClient = 'Apollo'// Apollo or Reddit
// ==============================

const widgetSize = config.widgetFamily;
const df = new DateFormatter()
      df.dateFormat = 'MMMM dd, yyyy'

const txtBGColor = Color.dynamic(new Color('#D5D7DCA6'), new Color('#242424A6'))
const txtColor = Color.dynamic(Color.black(), Color.white());
      
const top = Color.dynamic(new Color('#ffffff'), new Color('#0F2D60'));
const middle = Color.dynamic(new Color('#EDEDED'), new Color('#000427'));
const bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#000000'));
const bgGradient = new LinearGradient()
      bgGradient.locations = [0, 0.4, 1]
      bgGradient.colors = [top, middle, bottom]
      
const appIcon = {
Reddit: 'https://is5-ssl.mzstatic.com/image/thumb/Purple126/v4/e8/a6/65/e8a66539-19c0-2748-3f7d-2b0797ca602d/source/512x512bb.png',
Apollo: 'https://is2-ssl.mzstatic.com/image/thumb/Purple126/v4/d8/d8/f4/d8d8f4a8-41fb-4cef-2167-0d3589c25b5d/source/512x512bb.png'}
'shortcut for downloading app icons from app-store: https://routinehub.co/shortcut/11635/'

// GET ACCESS-TOKEN FOR JSON API REQUEST
let reqToken = new Request('https://www.reddit.com/api/v1/access_token')
    reqToken.method = 'POST'
    reqToken.headers = {'Authorization': 'Basic ' + btoa(CLIENT_ID + ":" + CLIENT_SECRET)}
    reqToken.body = `grant_type=password&username=${USERNAME}&password=${PASSWORD}`

let resToken = await reqToken.loadJSON()
//console.warn(JSON.stringify(resToken, null, 2))

// GET USER-PROFILE JSON FROM API/V1/ME
let myReq = new Request('https://oauth.reddit.com/api/v1/me')
    myReq.headers = {
    'User-Agent': 'getKarmaForHRB7/v1.0',//The User-Agent content has no effect. You can write whatever you want here (e.g. 'ABC-123-XYZ-idk')
    'Authorization': `${resToken.token_type} ${resToken.access_token}`
    }

let data = await myReq.loadJSON()
//console.warn(JSON.stringify(data, null, 2))

var wParameter = await args.widgetParameter
  if (wParameter == null) {
    refresh = 60
    iconURL = appIcon.Reddit
    profileURL = `https://reddit.com/user/${USERNAME}`
} else if (wParameter.match(/reddit/i)) {
    wParameter.split(';')
    refresh = wParameter[1]
    iconURL = appIcon.Apollo
    profileURL = `apollo://reddit.com/user/${USERNAME}`
} else if (wParameter.match(/apollo/i)) {
    wParameter.split(';')
    refresh = wParameter[1]
    iconURL = appIcon.Apollo
    profileURL = `apollo://reddit.com/user/${USERNAME}`
}

// CALC THE TIME SINCE CREATING ACCOUNT
function minutesDiff() {
  let created = new Date(data.created*1000).getTime()
  let now = new Date(Date.now()).getTime()
  let minutesDiff = Math.floor((now - created) / 1000 / 60)
  return minutesDiff
}

if (minutesDiff() < 525600) { //525600min = one year
  since = Math.abs(minutesDiff()/60/24).toFixed(0)
  time = " d"
} else {
  since = Math.abs(minutesDiff()/60/24/7/4/12).toFixed(1)
  time = " y"
}

// FORMATING NUMBERS
var arr = [data.total_karma, data.link_karma, data.comment_karma, data.awarder_karma, data.awardee_karma, data.coins];

arr.forEach((item, index) => {
  arr[index] = Intl.NumberFormat('de-DE').format(item).toString(2)//de-DE: 1000=1.000; en-GB: 1000=1,000;
  if (item >= 1_000_000) {
  arr[index] += 'M'
} else if (item >= 1_000) {
  arr[index] += 'k'
  }
});

// DECLARE VARIABLES
var totalKarma = arr[0];
var postKarma = arr[1];
var commentKarma = arr[2];
var awarderKarma = arr[3];
var awardeeKarma = arr[4];
var rCoins = arr[5];
var profileImg = data.icon_img.split('?')
var bannerImg = data.subreddit.banner_img.split('?')
var userName = data.subreddit.display_name_prefixed
var userTitle = data.subreddit.title
var puplicDescription = data.subreddit.public_description
var goldExpiration = data.gold_expiration //End of Reddit Premium
var isGold = data.is_gold //might be a gold membership
var inboxCount = data.inbox_count //post inbox
var dateCreated = df.string(new Date(data.created*1000))//date of creating account
var accountAge = since + time

// GET IMAGES FROM GITHUB OR ICLOUD
const fm = FileManager.iCloud()
const dir = fm.joinPath(fm.documentsDirectory(), "Reddit-Widget")
const imgURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Images/'
async function saveImages() {
  console.log("loading & saving images")
  var imgs = ["karma.png", "coins.png", "cakedayConfetti.png", "cakedayApollo.png"]//, "coins2.png", "cakedayReddit.png"]//alternative symbols
  for(img of imgs) {
    let imgPath = fm.joinPath(dir, img);
      if(!fm.fileExists(imgPath)) {
      console.log("Loading image: " + img)
      let request = new Request(imgURL + img);
      image = await request.loadImage();
      fm.writeImage(imgPath, image);
    }
  }
}

async function getImageFor(name) {
  let imgPath = fm.joinPath(dir, name + ".png")
  await fm.downloadFileFromiCloud(imgPath)
  img = await fm.readImage(imgPath)
  return img
}


// ******** CREATE SMALL WIDGET *********
async function createSmallWidget(data) {
  var refreshDate = Date.now() + 1000*60*refresh
  let widget = new ListWidget()
      widget.setPadding(7, 7, 4, 7)
      widget.url = profileURL
      widget.refreshAfterDate = new Date(refreshDate)
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4) && showCakedayConfetti) {
    userName += ' 🍰 '
    widget.backgroundImage = await getImageFor("cakedayConfetti")
} else if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4) && !showCakedayConfetti) {
    userName += ' 🍰 '
    widget.backgroundGradient = bgGradient
   } else {
    widget.backgroundGradient = bgGradient
  }
  
      widget.addSpacer(5)
  
  let mainHeaderStack = widget.addStack()
  
  //Left Header
  let leftMainHeaderStack = mainHeaderStack.addStack()
      leftMainHeaderStack.backgroundColor = txtBGColor
      leftMainHeaderStack.cornerRadius = 11
      leftMainHeaderStack.setPadding(0, 5, 4, 6)
  
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

  let appIcon = await loadAppIcon();
  let appIconElement = leftHeaderStackL.addImage(appIcon)
      appIconElement.imageSize = new Size(30, 30);
      appIconElement.cornerRadius = 6
      appIconElement.centerAlignImage()
  
      widget.addSpacer(5)
      leftMainHeaderStack.addSpacer(5)
  
  let wTitle = rightHeaderStackL.addText('Reddit')
      wTitle.font = Font.blackSystemFont(14)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()
  
 if (userName.length > 13) {
  let wSubtitle = rightHeaderStackL.addText(userName)
      wSubtitle.font = Font.lightSystemFont(12)
      wSubtitle.textColor = txtColor
      wSubtitle.centerAlignText()
      wSubtitle.minimumScaleFactor = 0.8
      wSubtitle.lineLimit = 1
} else {
      wSubtitle = rightHeaderStackL.addText(userName)
      wSubtitle.font = Font.lightSystemFont(12)
      wSubtitle.textColor = txtColor
      wSubtitle.centerAlignText()
      wSubtitle.minimumScaleFactor = 0.9
      wSubtitle.lineLimit = 1
    }
  
 if (showNotifyBadge && inboxCount > 0) {
  let badgeSymbol = SFSymbol.named(`${inboxCount}.circle`)
  let badgeSymbolElement = rightHeaderStackR.addImage(badgeSymbol.image)
      badgeSymbolElement.imageSize = new Size(15, 15)
      badgeSymbolElement.tintColor = Color.red()
    }
  
      widget.addSpacer(4)
  
  let mainStack = widget.addStack()
      mainStack.backgroundColor = txtBGColor
      mainStack.layoutVertically()
      mainStack.cornerRadius = 11
      mainStack.setPadding(5, 5, 5, 25)

  let lineOneStack = mainStack.addStack()
      lineOneStack.setPadding(0, 0, 0, 0)
      lineOneStack.centerAlignContent()
  
  let bodyTxt = mainStack.addStack()
      bodyTxt.layoutVertically()
      bodyTxt.setPadding(0, 0, 0, 0)
  
  let karmaImage = lineOneStack.addImage(await getImageFor("karma"))
      karmaImage.imageSize = new Size(14, 14)
  
      lineOneStack.addSpacer(5)
  
  let karmaTxt = lineOneStack.addText(totalKarma)
      karmaTxt.font = Font.lightRoundedSystemFont(11)
      karmaTxt.textColor = txtColor

if (showCoinBalance) {
      lineOneStack.addSpacer(4)
  let line = lineOneStack.addText('|')
      line.font = Font.lightRoundedSystemFont(11)
      line.textColor = txtColor
      line.textOpacity = 0.5
      lineOneStack.addSpacer(4)
  let coinsImage = lineOneStack.addImage(await getImageFor("coins"))
      coinsImage.imageSize = new Size(12, 12)
      lineOneStack.addSpacer(5)
  let coinsTxt = lineOneStack.addText(rCoins)
      coinsTxt.font = Font.lightRoundedSystemFont(11)
      coinsTxt.textColor = txtColor
}

      bodyTxt.addSpacer(3)
  
  let line3 = bodyTxt.addText("Post Karma: " + postKarma)
      line3.font = Font.lightRoundedSystemFont(11)
      line3.textColor = txtColor
  
  let line4 = bodyTxt.addText("Comment Karma: " + commentKarma)
      line4.font = Font.lightRoundedSystemFont(11)
      line4.textColor = txtColor
  
  let line5 = bodyTxt.addText("Awarder Karma: " + awarderKarma)
      line5.font = Font.lightRoundedSystemFont(11)
      line5.textColor = txtColor
  
  let line6 = bodyTxt.addText("Awardee Karma: " + awardeeKarma)
      line6.font = Font.lightRoundedSystemFont(11)
      line6.textColor = txtColor
  
      widget.addSpacer(5)
  
      df.useShortTimeStyle()
  let footer = widget.addText("Last Refresh " + df.string(new Date()))
      footer.font = Font.mediumSystemFont(8);
      footer.textOpacity = 0.4
      footer.centerAlignText()
  
  return widget
}


//********** CEEATE MEDIUM WIDGET *********
async function createMediumWidget(data) {
  var refreshDate = Date.now() + 1000*60*refresh
  let widget = new ListWidget()
      widget.setPadding(15, 15, 3, 15)
      widget.refreshAfterDate = new Date(refreshDate)
      
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4) && showCakedayConfetti) {
    userName += ' 🍰 '
    widget.backgroundImage = await getImageFor("cakedayConfetti")
} else if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4) && !showCakedayConfetti) {
    userName += ' 🍰 '
    widget.backgroundGradient = bgGradient
   } else {
    widget.backgroundGradient = bgGradient
  }

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
  
  let leftHeaderStack = mainHeaderStackLeft.addStack()
      leftHeaderStack.layoutVertically()
  
  let rightHeaderStack = mainHeaderStackLeft.addStack()
      rightHeaderStack.layoutVertically()
      rightHeaderStack.setPadding(0, 5, 0, 0)
  
  let appIcon = await loadAppIcon();
  let appIconElement = leftHeaderStack.addImage(appIcon)
      appIconElement.imageSize = new Size(31, 31);
      appIconElement.cornerRadius = 7
  
  let wTitle = rightHeaderStack.addText('Reddit')
      wTitle.font = Font.blackSystemFont(15)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()
  
 if (showUserTitle && userTitle != '') {
  let wSubtitle = rightHeaderStack.addText(userName + ' - ' + userTitle)
      wSubtitle.font = Font.lightSystemFont(12)
      wSubtitle.textColor = txtColor
      spacer = 0
} else if (!showUserTitle || userTitle == "") {
  let wSubtitle = rightHeaderStack.addText(userName)
      wSubtitle.font = Font.lightSystemFont(12)
      wSubtitle.textColor = txtColor
      spacer = 70
 }
  
  let leftTextStack = widgetStackL.addStack()
      leftTextStack.layoutVertically()
      leftTextStack.setPadding(5, 9, -5, 0)
  
  let rightImageStack = widgetStack.addStack()
      rightImageStack.layoutVertically()
      rightImageStack.setPadding(25, spacer, 0, 0)

  let line1 = leftTextStack.addText("Total Karma: " + totalKarma)
      line1.font = Font.lightRoundedSystemFont(13)
      line1.textColor = txtColor
  
  let line2 = leftTextStack.addText("Comment Karma: " + commentKarma)
      line2.font = Font.lightRoundedSystemFont(13)
      line2.textColor = txtColor
  
  let line3 = leftTextStack.addText("Post Karma: " + postKarma)
      line3.font = Font.lightRoundedSystemFont(13)
      line3.textColor = txtColor
  
  let line4 = leftTextStack.addText("Awarder Karma: " + awarderKarma)
      line4.font = Font.lightRoundedSystemFont(13)
      line4.textColor = txtColor
  
  let line5 = leftTextStack.addText("Awardee Karma: " + awardeeKarma)
      line5.font = Font.lightRoundedSystemFont(13)
      line5.textColor = txtColor
  
  let profileImage = rightImageStack.addImage(await loadProfileImage())
      profileImage.imageSize = new Size(77, 77)
      profileImage.cornerRadius = cornerRadiusProfileImg
      profileImage.rightAlignImage()
      profileImage.url = profileURL
  
 if (showCoinBalance) {
  let coinsStack = rightImageStack.addStack()
      coinsStack.setPadding(2, 15, 2, 0)
      coinsStack.cornerRadius = 5
  let coinsImage = coinsStack.addImage(await getImageFor("coins"))
      coinsImage.imageSize = new Size(11, 15)
      coinsStack.addSpacer(5)
  let coinsNumber = coinsStack.addText(rCoins)
      coinsNumber.font = Font.lightRoundedSystemFont(12)  
      coinsNumber.textColor = txtColor
}
  
      leftTextStack.addSpacer()

      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Widget Refresh " + df.string(new Date()))  
      footer.font = Font.lightSystemFont(9)
      footer.textColor = txtColor
      footer.textOpacity = 0.4
      footer.centerAlignText()
  
  return widget
}


//********** CEEATE LARGE WIDGET *********
async function createLargeWidget(data) {
  let widget = new ListWidget()
      widget.setPadding(20, 15, 3, 14)
      widget.backgroundGradient = bgGradient
  
  var refreshDate = Date.now() + 1000*60*refresh
      widget.refreshAfterDate = new Date(refreshDate)
  
      widget.addSpacer()
  
  let profileImage = widget.addImage(await loadProfileImage())
      profileImage.imageSize = new Size(88, 88)
      profileImage.cornerRadius = cornerRadiusProfileImg
      profileImage.url = profileURL
  
      widget.addSpacer(10)
  
  let headerStack = widget.addStack()
  
  if (showUserTitle && userTitle != '') {
    let headerTitle = headerStack.addText(userTitle)
        headerTitle.font = Font.mediumSystemFont(22)  
        headerTitle.textColor = txtColor
        headerTitle.url = profileURL

    let headerUsername = widget.addText(`${userName} • ${totalKarma} Karma • ${rCoins} Coin Balance \n${accountAge} • ${dateCreated}`)
        headerUsername.font = Font.thinSystemFont(14)  
        headerUsername.textColor = txtColor
        headerUsername.textOpacity = 0.8
        
  } else if (!showUserTitle || userTitle == "") {
    let headerTitle = headerStack.addText(userName)
        headerTitle.font = Font.mediumSystemFont(22)  
        headerTitle.textColor = txtColor
        headerTitle.url = profileURL

    let headerUsername = widget.addText(`${totalKarma} Karma • ${rCoins} Coin Balance \n${accountAge} • ${dateCreated}`)
        headerUsername.font = Font.thinSystemFont(14)
        headerUsername.textOpacity = 0.8
  }
  
  if (df.string(new Date()).slice(0, -4) == dateCreated.slice(0, -4)) {
      headerStack.addSpacer(7)
      headerTitleCakeDay = headerStack.addImage(await getImageFor(`cakeday${standardRedditClient}`))
      headerTitleCakeDay.imageSize = new Size(25, 25)
}

  let headerDescription = widget.addText(puplicDescription)
      headerDescription.font = Font.thinSystemFont(14)  
      headerDescription.textColor = txtColor
      headerDescription.textOpacity = 0.8
      headerDescription.lineLimit = 1
      headerDescription.minimumScaleFactor = 0.9
   
      widget.addSpacer()
  
  let mainBodyStack = widget.addStack()
      mainBodyStack.layoutVertically()
  
  let line2 = mainBodyStack.addText("Post Karma: " + postKarma)
      line2.font = Font.lightSystemFont(17)
      line2.textColor = txtColor
  
  let line3 = mainBodyStack.addText("Comment Karma: " + commentKarma)
      line3.font = Font.lightSystemFont(17)
      line3.textColor = txtColor
  
  let line4 = mainBodyStack.addText("Awarder Karma: " + awarderKarma)
      line4.font = Font.lightSystemFont(17)
      line4.textColor = txtColor
  
  let line5 = mainBodyStack.addText("Awardee Karma: " + awardeeKarma)
      line5.font = Font.lightSystemFont(17)
      line5.textColor = txtColor    
  
      widget.addSpacer()
  
      df.useShortTimeStyle()
      df.useShortDateStyle()
  let footer = widget.addText("Last Widget Refresh " + df.string(new Date()))  
      footer.font = Font.lightSystemFont(11)
      footer.textColor = txtColor
      footer.textOpacity = 0.3
      footer.centerAlignText()
  
  return widget
}

async function loadAppIcon() {
  let req = new Request(iconURL)
  return req.loadImage()
}

async function loadProfileImage() {
  let req = new Request(profileImg[0])
  return req.loadImage()
}

await saveImages()
try {saveData(data)}
catch {}

if (config.runsInApp) {
    await presentMenu()
} else if (config.runsInWidget) {
   switch(widgetSize) {
    case "small": widget = await createSmallWidget(data);
    break;
    case "medium": widget = await createMediumWidget(data);
    break;
    case "large": widget = await createLargeWidget(data);
    break;
    default: widget = await createSmallWidget(data);
  }
  Script.setWidget(widget)
}

async function presentMenu(data) {
  let alert = new Alert(data)
  alert.title = "Reddit Widget: " + userName
  alert.message = `Total Karma: ${totalKarma} | Coins: ${rCoins} | Inbox: ${inboxCount}`
  alert.addAction("Small")
  alert.addAction("Medium")
  alert.addAction("Large")
  alert.addDestructiveAction("Open Profile ↗")
  alert.addCancelAction("Cancel")
  let idx = await alert.presentSheet(data)
  if (idx == 0) {
    let widget = await createSmallWidget(data)
    await widget.presentSmall()
  } else if (idx == 1) {
    let widget = await createMediumWidget(data)
    await widget.presentMedium()
  } else if (idx == 2) {
    let widget = await createLargeWidget(data)
    await widget.presentLarge()
  } else if (idx == 3) {
    Safari.open(`${standardRedditClient}://reddit.com/user/${USERNAME}/`)
  }
}


