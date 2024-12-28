// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: robot;
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: robot;
// Variables used by Scriptable.
// *************************
// Created by Reddit user u/iamrbn
// Script URL: https://github.com/iamrbn/Reddit-Widget

// ===========================================
// ========== START CONFIG ZONE ==============

let refreshInt = 60 //refreshinterval as number in minutes
let showNotifyBadge = true //all home-widget sizes
let showUserTitle = false //medium- & large widget
let numberFormatting = 'de-DE' //For karma valuese. e.g.: en-EN, en-IN etc.
let widgetIcon = 'alienblue' //small- & medium widget; available icons: alienblue, black, classic, orange, roundorange, oldReddit, reddit, apollo;
let widgetType = 'post' // input: karma or post

// =========== END CONFIG ZONE ================
//=============================================

let df = Object.assign(new DateFormatter(), {dateFormat: 'MMMM dd, yyyy'})
let fm = FileManager.iCloud()
let imgKey = Keychain
let wParameter = await args.widgetParameter
if (wParameter === null) wParameter = widgetType
else if (wParameter.toLowerCase().includes('karma')) widgetType = 'karma'
else if (wParameter.toLowerCase().includes('post')) widgetType = 'post'
//console.log(imgKey.get("nameProfileImage"))
//imgKey.remove("nameProfileImage") //reset keychain of profile image
let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let modulePath = fm.joinPath(dir, 'redditModule.js')
if (!fm.fileExists(modulePath)) await loadModule()
if (!fm.isFileDownloaded(modulePath)) await fm.downloadFileFromiCloud(modulePath)
let rModule = importModule(modulePath)
let jsonPath = fm.joinPath(dir, 'UserCredentials.json')
let txtBGColor = Color.dynamic(new Color('#D5D7DC40'), new Color('#24242421'))
let txtColor = Color.dynamic(Color.black(), Color.white())
let d = await rModule.getKarmaFromAPI(numberFormatting)
let uCheck = await rModule.updateCheck(1.51)

if (config.runsInApp && typeof d !== "number"){
    await rModule.saveAllImages(d.snoovatarImg)
    await rModule.presentMenu(d, imgKey)
} else if (config.runsInApp && typeof d === "number"){
    await rModule.askForLoginDatas()
    await rModule.saveAllImages(d.snoovatarImg)
    await rModule.presentMenu(d, imgKey)
} else if (config.runsInWidget || config.runsInAccessoryWidget){
    switch (config.widgetFamily){
      case 'accessoryCircular':
        if (typeof d === "number" || uCheck.needUpdate) w = await rModule.infoWidget(d, uCheck)
        else if (widgetType === 'karma') w = await circularKarmaWidget()
        else if (widgetType === 'post') w = await circularPostWidget()
      break;
        
      case 'accessoryRectangular':
        if (typeof d === "number" || uCheck.needUpdate) w = await rModule.infoWidget(d, uCheck)
        else w = await rectangularPostWidget()
      break;
        
      case 'small':
        if (typeof d === "number" || uCheck.needUpdate) w = await rModule.infoWidget(d, uCheck)
        else if (widgetType === 'post') w = await smallPostWidget()
        else if (widgetType === 'karma') w = await smallKarmaWidget()
      break;
      
      case 'medium':
        if (typeof d === "number" || uCheck.needUpdate) w = await rModule.infoWidget(d, uCheck)
        else if (widgetType === 'post') w = await mediumPostWidget()
        else if (widgetType === 'karma') w = await mediumKarmaWidget()
      break;
      
      case 'large':
        if (typeof d === "number" || uCheck.needUpdate) w = await rModule.infoWidget(d, uCheck)
        else if (widgetType === 'post') w = await largePostWidget()
        else if (widgetType === 'karma') w = await largeKarmaWidget()
      break;
      default: w = await rModule.infoWidget(d, uCheck)
    }
    Script.setWidget(w)
};
   
     
//************************************    
//******** CIRCULAR LS WIDGET ********
//************************************
async function circularPostWidget(){
  let w = new ListWidget()
      w.url = d.link
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      w.addAccessoryWidgetBackground = true

      let upvoteStack = w.addStack()
          upvoteStack.spacing = 3
          upvoteStack.centerAlignContent()
      
          w.addSpacer(2)
      
      let commentStack = w.addStack()
          commentStack.spacing = 3
          commentStack.centerAlignContent()
   
      let upvoteSF = SFSymbol.named('arrow.up')
          upvoteSF.applyFont(Font.lightRoundedSystemFont(150))
        
      let upvoteImg = upvoteStack.addImage(upvoteSF.image)
          upvoteImg.imageSize = new Size(18, 13)
          upvoteImg.centerAlignImage()
          upvoteImg.tintColor = Color.white()
        
      let wUpvote = upvoteStack.addText(d.upvotes)
          wUpvote.font = Font.boldRoundedSystemFont(12)
          wUpvote.textColor = Color.white()
          wUpvote.centerAlignText()
        
      let commentSF = SFSymbol.named('bubble.left.and.bubble.right')
          commentSF.applyFont(Font.lightRoundedSystemFont(150))
       
      let commentImg = commentStack.addImage(commentSF.image) //bubble or bubble.fill
          commentImg.imageSize = new Size(18, 18)
          commentImg.tintColor = Color.white()
          commentImg.centerAlignImage()
        
      let wComment = commentStack.addText(d.numComments)
          wComment.font = Font.boldRoundedSystemFont(12)
          wComment.textColor = Color.white()
          wComment.centerAlignText()
  //}
    
 return w
};
  
      
//*************************************  
//****** RECTANGULAR LS WIDGET ********
//*************************************
async function rectangularPostWidget(){
  let w = new ListWidget()
      w.url = d.link
      w.setPadding(0, 0, 0, 0)
      w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)

      let mainStack = w.addStack()
          mainStack.layoutVertically()
          mainStack.backgroundColor = Color.black()
          mainStack.cornerRadius = 10
          mainStack.size = new Size(156, 72)
          mainStack.setPadding(0, 2, -1, 2)
         
      let headerStack = mainStack.addStack()
          headerStack.centerAlignContent()
        
          headerStack.addSpacer(1)
          
      let wIcon = headerStack.addImage(await rModule.getImageFor('redditLS'))
          wIcon.imageSize = new Size(11, 12)
          wIcon.tintColor = Color.white()
          wIcon.centerAlignImage()
        
          headerStack.addSpacer(4)
          
      let wTitle = headerStack.addText(d.sub)
          wTitle.font = Font.boldRoundedSystemFont(10)
          wTitle.textColor = Color.white()
          
      let bodyStack = mainStack.addStack()
          bodyStack.size = new Size(151, 45)
          bodyStack.layoutVertically()
        
      let wBody = bodyStack.addText(d.body)
          wBody.font = Font.regularRoundedSystemFont(10)
          wBody.textColor = Color.white()
          wBody.minimumScaleFactor = 0.8
        
          bodyStack.addSpacer()
          
      let footerStack = mainStack.addStack()
          footerStack.centerAlignContent()
          footerStack.spacing = 1
          footerStack.setPadding(-1, 0, -2, 0)
          
          footerStack.addSpacer(1)
          
      let commentSF = SFSymbol.named('bubble.left.and.bubble.right')
          commentSF.applyFont(Font.lightRoundedSystemFont(150))
          commentSF.applyBoldWeight()
      let commentImg = footerStack.addImage(commentSF.image)
          commentImg.imageSize = new Size(11, 12)
          commentImg.tintColor = Color.white()
          commentImg.leftAlignImage()
      let wComment = footerStack.addText(d.numComments.toString())
          wComment.font = Font.regularRoundedSystemFont(8)
          wComment.textColor = Color.white()
          wComment.rightAlignText()
          
          footerStack.addSpacer(1)

      let upvoteSF = SFSymbol.named('arrow.up')
          upvoteSF.applyFont(Font.boldRoundedSystemFont(150))
          upvoteSF.applyBoldWeight()
      let upvoteImg = footerStack.addImage(upvoteSF.image)
          upvoteImg.imageSize = new Size(8, 9)
          upvoteImg.leftAlignImage()
          upvoteImg.tintColor = Color.white()
      let wUpvote = footerStack.addText(d.upvotes.toString())
          wUpvote.font = Font.regularRoundedSystemFont(8)
          wUpvote.textColor = Color.white()
          wUpvote.rightAlignText()
          
      /*-------------------
      let downvoteSF = SFSymbol.named('arrow.down')
          downvoteSF.applyFont(Font.boldRoundedSystemFont(150))
          downvoteSF.applyBoldWeight()
      let downvoteImg = footerStack.addImage(downvoteSF.image)
          downvoteImg.imageSize = new Size(8, 9)
          downvoteImg.leftAlignImage()
          downvoteImg.tintColor = Color.white()
      let wDownvote = footerStack.addText(d.downvotes.toString())
          wDownvote.font = Font.regularRoundedSystemFont(8)
          wDownvote.textColor = Color.white()
          wDownvote.rightAlignText()
      ---------------------*/   
          footerStack.addSpacer(1)
              
      let wAuthor = footerStack.addText(d.author + ' • ' + d.postAge)
          wAuthor.font = Font.regularRoundedSystemFont(9)
          wAuthor.textColor = Color.white()
          wAuthor.minimumScaleFactor = 0.8
  //}
    
 return w
};


//*************************************    
//******** SMALL POST WIDGET **********
//*************************************
async function smallPostWidget(){
  let w = new ListWidget()
      w.url = d.link
      w.setPadding(5, 5, 1, 3)
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      await rModule.createBG(w, false, d.contentLink)

      let mainStack = w.addStack()
          mainStack.layoutVertically()
         
      let headerStack = mainStack.addStack()
          headerStack.spacing = 4
          headerStack.centerAlignContent()
          
          headerStack.addSpacer(1)
          
      let wIcon = headerStack.addImage(await rModule.getImageFor('redditLS'))
          wIcon.imageSize = new Size(13, 13)
          wIcon.tintColor = Color.dynamic(new Color('#FD3F12'), new Color('#ffffff'))
          wIcon.centerAlignImage()
          
      let wTitle = headerStack.addText(d.sub)
          wTitle.font = Font.boldRoundedSystemFont(11)
          wTitle.minimumScaleFactor = 0.7
          
          mainStack.addSpacer(2)
          
      let bodyStack = mainStack.addStack()
          bodyStack.layoutVertically()
          
      let wSubtitle = bodyStack.addText(d.title + '\r' + d.link_author)
      
      if (d.kind.includes('t1')){
        sFont = Font.lightRoundedSystemFont(10)
        sOpacity = 0.7
      } else if (d.kind.includes('t3')){
        sFont = Font.boldRoundedSystemFont(10)
        sOpacity = 1.0
      }
          wSubtitle.font = sFont
          wSubtitle.textOpacity = sOpacity
          wSubtitle.minimumScaleFactor = 0.8
          
          mainStack.addSpacer(3)
        
      let wBody = bodyStack.addText(d.body)
          wBody.font = Font.regularRoundedSystemFont(10)
          wBody.leftAlignText()
          wBody.minimumScaleFactor = 0.8
          
      let wBody2 = bodyStack.addText(d.url)
          wBody2.font = Font.regularRoundedSystemFont(10)
          wBody2.textColor = Color.blue()
          wBody2.minimumScaleFactor = 0.5
          wBody2.url = d.url
          
          mainStack.addSpacer()
          
      let footerStack = mainStack.addStack()
          footerStack.centerAlignContent()
          footerStack.spacing = 1
          await rModule.createBG(footerStack, true, null)
          footerStack.borderColor = Color.dynamic(new Color('#EDEDED'), new Color('#FD3F12'))
          footerStack.borderWidth = 0.5
          footerStack.cornerRadius = 12
          footerStack.setPadding(3, 7, 3, 7)
          
      let commentSF = SFSymbol.named('bubble.left.and.bubble.right')
          commentSF.applyFont(Font.lightRoundedSystemFont(150))
          commentSF.applyLightWeight()
      let commentImg = footerStack.addImage(commentSF.image)
          commentImg.imageSize = new Size(11, 12)
          commentImg.tintColor = txtColor
      let wComment = footerStack.addText(d.numComments.toString())
          wComment.font = Font.lightRoundedSystemFont(9)
          
          footerStack.addSpacer(1)

      let upvoteSF = SFSymbol.named('arrow.up')
          upvoteSF.applyFont(Font.lightRoundedSystemFont(150))
          upvoteSF.applyLightWeight()
      let upvoteImg = footerStack.addImage(upvoteSF.image)
          upvoteImg.imageSize = new Size(8, 9)
          upvoteImg.tintColor = txtColor
      let wUpvote = footerStack.addText(d.upvotes.toString())
          wUpvote.font = Font.lightRoundedSystemFont(9)
      /*---------------
      let downvoteSF = SFSymbol.named('arrow.down')
          downvoteSF.applyFont(Font.lightRoundedSystemFont(150))
          downvoteSF.applyLightWeight()  
      let downvoteImg = footerStack.addImage(downvoteSF.image)
          downvoteImg.imageSize = new Size(8, 9)
          downvoteImg.tintColor = Color.white()
      let wDownvote = footerStack.addText(d.downvotes.toString())
          wDownvote.font = Font.lightRoundedSystemFont(9)
          wDownvote.textColor = Color.white()
      ----------------*/
          footerStack.addSpacer(2)
              
      let wAuthor = footerStack.addText(d.author + ' • ' + d.postAge)
          wAuthor.font = Font.lightRoundedSystemFont(9)
          wAuthor.minimumScaleFactor = 0.8
  //}
      w.addSpacer(1)
      
      df.useShortTimeStyle()
  let footer = w.addText("Last Refresh " + df.string(new Date()))
      footer.font = Font.regularRoundedSystemFont(7)
      footer.textOpacity = 0.3
      footer.centerAlignText()
             
 return w 
};



//*************************************  
//******** MEDIUM POST WIDGET *********
//*************************************
async function mediumPostWidget(){
  let w = new ListWidget()
      w.setPadding(10, 10, 2, 5)
      w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
      await rModule.createBG(w, false, d.contentLink)

      let mainStack = w.addStack()
          mainStack.layoutVertically()
       
      let headerStack = mainStack.addStack()
          headerStack.spacing = 6
          headerStack.centerAlignContent()
          
      let wIcon = headerStack.addImage(await rModule.getImageFor('redditLS'))
          wIcon.imageSize = new Size(17, 17)
          wIcon.tintColor = Color.dynamic(new Color('#FD3F12'), new Color('#ffffff'))
          wIcon.centerAlignImage()
          
      let wTitle = headerStack.addText(d.sub)
          wTitle.font = Font.boldRoundedSystemFont(15)
          wTitle.url = d.subURL
          
      let wCredit = headerStack.addText(d.link_author)
          wCredit.font = Font.lightRoundedSystemFont(12)
          wCredit.textOpacity = 0.7
          wCredit.url = 'https://reddit.com/'+ d.link_author.replace('‣ ', '')
          
      let bodyStack = mainStack.addStack()
          bodyStack.layoutVertically()
          
      let wSubtitle = bodyStack.addText(d.title)
      if (d.kind.includes('t1')){
          sFont = Font.lightRoundedSystemFont(12)
          sOpacity = 0.7
      } else if (d.kind.includes('t3')){
          sFont = Font.boldRoundedSystemFont(12)
          sOpacity = 1.0
      }
          wSubtitle.font = sFont
          wSubtitle.textOpacity = sOpacity
          wSubtitle.url = d.link
          
          bodyStack.addSpacer(4)
        
      let wBody = bodyStack.addText(d.body)
          wBody.font = Font.regularRoundedSystemFont(12)
          wBody.leftAlignText()
          wBody.lineLimit = 5
          wBody.minimumScaleFactor = 0.8
          wBody.url = d.link
          
      let wBody2 = bodyStack.addText(d.url)
          wBody2.font = Font.regularRoundedSystemFont(12)
          wBody2.textColor = Color.blue()
          wBody2.minimumScaleFactor = 0.5
          wBody2.url = d.url
          
          bodyStack.addSpacer()
          
      let footerStack = mainStack.addStack()
          footerStack.centerAlignContent()
          await rModule.createBG(footerStack, true, null)
          footerStack.borderColor = Color.dynamic(new Color('#EDEDED'), new Color('#FD3F12'))
          footerStack.borderWidth = 0.5
          footerStack.cornerRadius = 13
          footerStack.setPadding(3, 15, 3, 15)
          footerStack.spacing = 2
          
      let commentSF = SFSymbol.named('bubble.left.and.bubble.right')
          commentSF.applyFont(Font.regularRoundedSystemFont(150))
          commentSF.applyRegularWeight()
      let commentImg = footerStack.addImage(commentSF.image)
          commentImg.imageSize = new Size(15, 16)
          commentImg.tintColor = txtColor
          commentImg.leftAlignImage()
      let wComment = footerStack.addText(d.numComments.toString())
          wComment.font = Font.regularRoundedSystemFont(11)
          wComment.rightAlignText()
          
          
      if (d.kind.includes('t3')){
              footerStack.addSpacer(2)
              
          let crosspostSF = SFSymbol.named('arrow.trianglehead.branch')
              crosspostSF.applyFont(Font.regularRoundedSystemFont(150))
              crosspostSF.applyRegularWeight()
          let crosspostImg = footerStack.addImage(crosspostSF.image)
              crosspostImg.imageSize = new Size(14, 15)
              crosspostImg.tintColor = txtColor
              crosspostImg.leftAlignImage()
          let wCrosspost = footerStack.addText(d.numCrossposts.toString())
              wCrosspost.font = Font.regularRoundedSystemFont(11)
              wCrosspost.rightAlignText()
      }
          
          footerStack.addSpacer(8)

      let upvoteSF = SFSymbol.named('arrow.up')
          upvoteSF.applyFont(Font.regularRoundedSystemFont(150))
          upvoteSF.applyRegularWeight()
      let upvoteImg = footerStack.addImage(upvoteSF.image)
          upvoteImg.imageSize = new Size(10, 11)
          upvoteImg.tintColor = txtColor
          upvoteImg.leftAlignImage()
      let wUpvote = footerStack.addText(d.upvotes.toString())
          wUpvote.font = Font.regularRoundedSystemFont(11)
          wUpvote.rightAlignText()
          
          footerStack.addSpacer(0.5)
            
      let downvoteSF = SFSymbol.named('arrow.down')
          downvoteSF.applyFont(Font.regularRoundedSystemFont(150))
          downvoteSF.applyRegularWeight()
      let downvoteImg = footerStack.addImage(downvoteSF.image)
          downvoteImg.imageSize = new Size(10, 11)
          downvoteImg.tintColor = txtColor
      let wDownvote = footerStack.addText(d.downvotes.toString())
          wDownvote.font = Font.regularRoundedSystemFont(11)
            
          footerStack.addSpacer(8)
              
      let wAuthor = footerStack.addText(d.author + ' • ' + d.postAge)
          wAuthor.font = Font.regularRoundedSystemFont(11)
          //wAuthor.minimumScaleFactor = 0.8
  //}
      
      w.addSpacer(2)
          
      df.useShortTimeStyle()
  let footer = w.addText("Last Widget Refresh " + df.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(8)
      footer.textOpacity = 0.3
      footer.centerAlignText()
              
 return w
};
    

//*************************************
//******** LARGE POST WIDGET **********
//*************************************
async function largePostWidget(){
  let w = new ListWidget()
      w.setPadding(10, 10, 3, 5)
      w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
      await rModule.createBG(w, false, d.contentLink)

      let mainStack = w.addStack()
          mainStack.layoutVertically()
         
      let headerStack = mainStack.addStack()
          headerStack.spacing = 6
          headerStack.centerAlignContent()
          
      let wIcon = headerStack.addImage(await rModule.getImageFor('redditLS'))
          wIcon.imageSize = new Size(18, 18)
          wIcon.tintColor = Color.dynamic(new Color('#FD3F12'), new Color('#ffffff'))
          wIcon.centerAlignImage()
          
      let wTitle = headerStack.addText(d.sub)
          wTitle.font = Font.boldRoundedSystemFont(16)
          wTitle.url = d.subURL
          
      let wCredit = headerStack.addText(d.link_author)
          wCredit.font = Font.lightRoundedSystemFont(14)
          wCredit.textOpacity = 0.7
          wCredit.url = 'https://reddit.com/'+ d.link_author

          mainStack.addSpacer(4)

      let bodyStack = mainStack.addStack()
          bodyStack.layoutVertically()
          
      let wSubtitle = bodyStack.addText(d.title)
      if (d.kind.includes('t1')){
          sFont = Font.lightRoundedSystemFont(16)
          sOpacity = 0.7
      } else if (d.kind.includes('t3')){
          sFont = Font.boldRoundedSystemFont(16)
          sOpacity = 1.0
      }
          wSubtitle.font = sFont
          wSubtitle.textOpacity = sOpacity
          wSubtitle.url = d.link
          
          bodyStack.addSpacer(7)
        
      let wBody = bodyStack.addText(d.body)
          wBody.font = Font.regularRoundedSystemFont(16)
          wBody.leftAlignText()
          wBody.minimumScaleFactor = 0.8
          wBody.url = d.link
          
      let wBody2 = bodyStack.addText(d.url)
          wBody2.font = Font.regularRoundedSystemFont(16)
          wBody2.textColor = Color.blue()
          wBody2.minimumScaleFactor = 0.5
          wBody2.url = d.url
          
          bodyStack.addSpacer()
          
      let footerStack = mainStack.addStack()
          footerStack.centerAlignContent()
          footerStack.spacing = 3
          await rModule.createBG(footerStack, true, null)
          footerStack.borderColor = Color.dynamic(new Color('#EDEDED'), new Color('#FD3F12'))
          footerStack.borderWidth = 0.5
          footerStack.cornerRadius = 15
          footerStack.setPadding(3, 15, 3, 15)
          
      let commentSF = SFSymbol.named('bubble.left.and.bubble.right')
          commentSF.applyFont(Font.lightRoundedSystemFont(150))
          commentSF.applyRegularWeight()
      let commentImg = footerStack.addImage(commentSF.image)
          commentImg.imageSize = new Size(16, 17)
          commentImg.tintColor = txtColor
          commentImg.leftAlignImage()
      let wComment = footerStack.addText(d.numComments.toString())
          wComment.font = Font.lightRoundedSystemFont(13)
          wComment.rightAlignText()
          
      if (d.kind.includes('t3')){
              footerStack.addSpacer(2)
              
          let crosspostSF = SFSymbol.named('arrow.trianglehead.branch')
              crosspostSF.applyFont(Font.lightRoundedSystemFont(150))
              crosspostSF.applyRegularWeight()
          let crosspostImg = footerStack.addImage(crosspostSF.image)
              crosspostImg.imageSize = new Size(13, 14)
              crosspostImg.tintColor = txtColor
              crosspostImg.leftAlignImage()
          let wCrosspost = footerStack.addText(d.numCrossposts.toString())
              wCrosspost.font = Font.lightRoundedSystemFont(13)
              wCrosspost.rightAlignText()
      }
          
          footerStack.addSpacer(5)

      let upvoteSF = SFSymbol.named('arrow.up')
          upvoteSF.applyFont(Font.lightRoundedSystemFont(150))
          upvoteSF.applyRegularWeight()
      let upvoteImg = footerStack.addImage(upvoteSF.image)
          upvoteImg.imageSize = new Size(11, 12)
          upvoteImg.leftAlignImage()
          upvoteImg.tintColor = txtColor
      let wUpvote = footerStack.addText(d.upvotes.toString())
          wUpvote.font = Font.lightRoundedSystemFont(13)
          wUpvote.rightAlignText()
          
          footerStack.addSpacer(1)
            
      let downvoteSF = SFSymbol.named('arrow.down')
          downvoteSF.applyFont(Font.lightRoundedSystemFont(150))
          downvoteSF.applyRegularWeight()
      let downvoteImg = footerStack.addImage(downvoteSF.image)
          downvoteImg.imageSize = new Size(11, 12)
          downvoteImg.tintColor = txtColor
          downvoteImg.leftAlignImage()
      let wDownvote = footerStack.addText(d.downvotes.toString())
          wDownvote.font = Font.lightRoundedSystemFont(13)
          wDownvote.rightAlignText()
            
          footerStack.addSpacer(5)
              
      let wAuthor = footerStack.addText(d.author + ' • ' + d.postAge)
          wAuthor.font = Font.lightRoundedSystemFont(13)
          //wAuthor.minimumScaleFactor = 0.8
      
      w.addSpacer(2)
          
      df.useShortTimeStyle()
  let footer = w.addText("Last Widget Refresh " + df.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(8)
      footer.textOpacity = 0.3
      footer.centerAlignText()
              
 return w
};
   


//***************************************
//******** CIRCULAR KARMA WIDGET ********
//***************************************
async function circularKarmaWidget(){
   let w = new ListWidget()
       w.url = d.link
       w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
       w.addAccessoryWidgetBackground = true
      
       img = w.addImage(await rModule.getImageFor("arrowsLS"))
       img.imageSize = new Size(40, 20)
       img.centerAlignImage()
        
       w.addSpacer(5)
        
       total_Karma = w.addText(d.totalKarma)
       total_Karma.textColor = Color.white()
       total_Karma.font = Font.boldRoundedSystemFont(13)
       total_Karma.minimumScaleFactor = 0.6
       total_Karma.lineLimit = 1
       total_Karma.centerAlignText()
    
  return w
};
  
  
//*************************************
//******** SMALL KARMA WIDGET *********
//*************************************
async function smallKarmaWidget(){
  let w = new ListWidget()
      w.setPadding(7, 6, 2, 6)
      w.url = d.link
      w.refreshAfterDate = new Date(Date.now() + 1000*60* refreshInt)

  if (df.string(new Date()).slice(0, -4) == d.profileCreated.slice(0, -4)){
      cDtrue = ' 🍰'
      w.backgroundImage = await rModule.getImageFor("cakedayConfetti")
  } else {
      cDtrue = ''
      await rModule.createBG(w, false, null)
  }
      
  let mainHeaderStack = w.addStack()
      
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
    
    
  let appIconElement = leftHeaderStackL.addImage(await rModule.getImageFor(widgetIcon))
      appIconElement.imageSize = new Size(30, 30)
      appIconElement.cornerRadius = 15
      appIconElement.centerAlignImage()
      
      w.addSpacer(5)
      leftMainHeaderStack.addSpacer(5)
      
  let wTitle = rightHeaderStackL.addText('reddit')
      wTitle.font = Font.boldRoundedSystemFont(16)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()
    
  let mSF = (d.username.length > 13) ? 0.8 : 0.9;
  let wSubtitle = rightHeaderStackL.addText(d.username)
      wSubtitle.font = Font.regularRoundedSystemFont(12)
      wSubtitle.textColor = txtColor
      wSubtitle.minimumScaleFactor = mSF
      wSubtitle.centerAlignText()
      wSubtitle.lineLimit = 1  
      
  if (showNotifyBadge && d.inboxCount > 0) {
      sfBadge = SFSymbol.named(`${d.inboxCount}.circle`)
      sfBadge.applyFont(Font.boldRoundedSystemFont(150))
      sfBadge.applyBoldWeight()
      
      badgeSymbolElement = rightHeaderStackR.addImage(sfBadge.image)
      badgeSymbolElement.imageSize = new Size(15, 15)
      badgeSymbolElement.tintColor = Color.red()
  };
    
      w.addSpacer(3)
      
  let mainStack = w.addStack()
      mainStack.backgroundColor = txtBGColor
      mainStack.layoutVertically()
      mainStack.cornerRadius = 11
      mainStack.setPadding(7, 5, 7, 1)
      mainStack.centerAlignContent()
    
  let lineOneStack = mainStack.addStack()
      lineOneStack.centerAlignContent()
      lineOneStack.spacing = 2
          
      rModule.addString(lineOneStack, await rModule.getImageFor('karma'), 0, 14, d.totalKarma, 11, 1.0)
      rModule.addText(lineOneStack, ' | ', 11, 0.4)
      rModule.addString(lineOneStack, await rModule.getImageFor('cakedayApollo'), 0, 14, d.accountAge, 11, 1.0)
          
      mainStack.addSpacer(3)
      lineOneStack.addSpacer()
      
  let line3 = mainStack.addText("Post: " + d.postKarma)
      line3.font = Font.regularRoundedSystemFont(11)
      line3.textColor = txtColor
      
  let line4 = mainStack.addText("Comment: " + d.commentKarma)
      line4.font = Font.regularRoundedSystemFont(11)
      line4.textColor = txtColor
      
  let line5 = mainStack.addText("Awarder: " + d.awarderKarma)
      line5.font = Font.regularRoundedSystemFont(11)
      line5.textColor = txtColor
      
  let line6 = mainStack.addText("Awardee: " + d.awardeeKarma)
      line6.font = Font.regularRoundedSystemFont(11)
      line6.textColor = txtColor
    
      w.addSpacer(4)
     
      df.useShortTimeStyle()
  let footer = w.addText("Last Refresh " + df.string(new Date()))
      footer.font = Font.regularRoundedSystemFont(8)
      footer.textColor = txtColor
      footer.textOpacity = 0.3
      footer.centerAlignText()
      
 return w
};
    

//****************************************
//********** MEDIUM KARMA WIDGET *********
//****************************************
async function mediumKarmaWidget(){
  let w = new ListWidget()
      w.setPadding(11, 15, 3, 15)
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)

  if (df.string(new Date()).slice(0, -4) == d.profileCreated.slice(0, -4)) w.backgroundImage = await rModule.getImageFor("cakedayConfetti")
  else await rModule.createBG(w, false, null)
    
  let widgetStack = w.addStack()
      widgetStack.setPadding(0, 0, 0, -15)
       
  let widgetStackL = widgetStack.addStack()
      widgetStackL.setPadding(0, 0, 0, 0)
      widgetStackL.layoutVertically()
      
  let mainHeaderStackLeft = widgetStackL.addStack()
      mainHeaderStackLeft.backgroundColor = txtBGColor
      mainHeaderStackLeft.setPadding(3, 5, 2, 7)
      mainHeaderStackLeft.cornerRadius = 12
      mainHeaderStackLeft.url = d.profileURL
      mainHeaderStackLeft.centerAlignContent()
      
  let leftHeaderStack = mainHeaderStackLeft.addStack()
      leftHeaderStack.layoutVertically()
      
  let rightHeaderStack = mainHeaderStackLeft.addStack()
      rightHeaderStack.layoutVertically()
      rightHeaderStack.setPadding(0, 5, 0, 0)
      
      
  let appIconElement = leftHeaderStack.addImage(await rModule.getImageFor(widgetIcon))
      appIconElement.imageSize = new Size(31, 31);
      appIconElement.cornerRadius = 7
      
  let wTitle = rightHeaderStack.addText('reddit')
      wTitle.font = Font.boldRoundedSystemFont(16)
      wTitle.textColor = txtColor
      wTitle.centerAlignText()
           
  if (showNotifyBadge && d.inboxCount > 0){
      sfBadge = SFSymbol.named(`${d.inboxCount}.circle`)
      sfBadge.applyFont(Font.boldRoundedSystemFont(150))
      sfBadge.applyBoldWeight()
      badgeSymbolElement = widgetStack.addImage(sfBadge.image)
      badgeSymbolElement.imageSize = new Size(15, 15)
      badgeSymbolElement.tintColor = Color.red()
  }
          
  if (showUserTitle && d.usertitle != ''){sbttl = d.username + ' - ' + d.usertitle; spacer = 10;}
  else if (!showUserTitle || d.usertitle == '') {sbttl = d.username; spacer = 70;}
      
  let wSubtitle = rightHeaderStack.addText(sbttl)
      wSubtitle.font = Font.regularRoundedSystemFont(12)
      wSubtitle.textColor = txtColor
    
  let leftTextStack = widgetStackL.addStack()
      leftTextStack.layoutVertically()
      leftTextStack.setPadding(5, 5, -5, 0)
      
  let rightImageStack = widgetStack.addStack()
      rightImageStack.layoutVertically()
      rightImageStack.setPadding(25, spacer, 0, 0)
        
      leftTextStack.addSpacer(4)  
          
  let line2 = leftTextStack.addText("Total Karma: " + d.totalKarma)
      line2.font = Font.lightRoundedSystemFont(13)
      line2.textColor = txtColor
      
  let line3 = leftTextStack.addText("Post Karma: " + d.postKarma)
      line3.font = Font.lightRoundedSystemFont(13)
      line3.textColor = txtColor
       
  let line4 = leftTextStack.addText("Comment Karma: " + d.commentKarma)
      line4.font = Font.lightRoundedSystemFont(13)
      line4.textColor = txtColor
      
  let line5 = leftTextStack.addText("Awarder Karma: " + d.awarderKarma)
      line5.font = Font.lightRoundedSystemFont(13)
      line5.textColor = txtColor
      
  let line6 = leftTextStack.addText("Awardee Karma: " + d.awardeeKarma)
      line6.font = Font.lightRoundedSystemFont(13)
      line6.textColor = txtColor
    
  let profileImage = rightImageStack.addImage(await rModule.getImageFor(imgKey.get("nameProfileImage")))     
      profileImage.imageSize = new Size(77, 77)
      profileImage.rightAlignImage()
      profileImage.url = d.profileURL
         
      rightImageStack.addSpacer(5)
      
      createdStack = rightImageStack.addStack()
      createdStack.addSpacer(15)
      createdStack.setPadding(-1.5, 0, -1.5, 0)
      cdImage = createdStack.addImage(await rModule.getImageFor('cakedayApollo'))
      cdImage.imageSize = new Size(17, 17)
      createdStack.addSpacer(2)
      cdString = createdStack.addText(d.accountAge)
      cdString.font = Font.regularRoundedSystemFont(12)  
      cdString.textColor = txtColor
      createdStack.addSpacer(5)
    
      leftTextStack.addSpacer()
    
      df.useShortTimeStyle()
  let footer = w.addText("Last Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(9)
      footer.textColor = txtColor
      footer.textOpacity = 0.4
      footer.centerAlignText()
     
 return w
};
  
      
//***************************************
//********** LARGE KARMA WIDGET *********
//***************************************
async function largeKarmaWidget(){
  let w = new ListWidget()
      w.setPadding(10, 15, 3, 5)
      w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
      await rModule.createBG(w, false, null)

  let bodyStack = w.addStack()
      bodyStack.layoutVertically()
       
  let imgStack = bodyStack.addStack()

  let profileImage = imgStack.addImage(await rModule.getImageFor(imgKey.get("nameProfileImage")));
      profileImage.imageSize = new Size(125, 125)
      profileImage.url = d.profileURL
      imgStack.addSpacer()
        
  let iconStack = imgStack.addStack()

  let iconImage = iconStack.addImage(await rModule.getImageFor(widgetIcon))
      iconImage.cornerRadius = 7
      iconImage.imageSize = new Size(22, 22)
      iconImage.url = d.profileURL
      iconStack.addSpacer(5)
    
  let headerStack = bodyStack.addStack()
      headerStack.setPadding(0, 0, 4, 0)
  let line1 = bodyStack.addStack()
      line1.centerAlignContent()
      line1.spacing = 3
  let line2 = bodyStack.addStack()
      line2.centerAlignContent()
      line2.spacing = 3
  let line3 = bodyStack.addStack()
      line3.centerAlignContent()
      line3.spacing = 3
        
  if (showUserTitle && d.usertitle != ''){
      hdrTtl = d.usertitle
      rModule.addText(line1, d.username + " ", 16, 1.0)
      rModule.addString(line1, await rModule.getImageFor('karma'), 0, 15, d.totalKarma + " Total Karma", 15, 0.9)
      rModule.addString(line2, await rModule.getImageFor('cakedayApollo'), 0, 15, d.profileCreated + " • " + "redditor since " + d.accountAge, 15, 0.9)
  } else if (!showUserTitle || d.usertitle == ''){
      hdrTtl = d.username
      rModule.addString(line1, await rModule.getImageFor('karma'), 0, 15, d.totalKarma + " Total Karma", 15, 0.9)
      rModule.addString(line2, await rModule.getImageFor('cakedayApollo'), 0, 15, d.profileCreated + " • " + "redditor since " + d.accountAge, 15, 0.9)
  }
      
  let headerTitle = headerStack.addText(hdrTtl)
      headerTitle.font = Font.boldRoundedSystemFont(24)
      headerTitle.textColor = txtColor
      headerTitle.url = d.profileURL
      
  if (df.string(new Date()).slice(0, -4) != d.profileCreated.slice(0, -4)){
      headerStack.addSpacer(7)
      headerTitleCakeDay = headerStack.addImage(await rModule.getImageFor('cakedayApollo'))
      headerTitleCakeDay.imageSize = new Size(28, 28)
      imgStack.backgroundImage = await rModule.getImageFor("cakedayConfetti")
  }
  
  if (showNotifyBadge && d.inboxCount > 0){
      headerStack.addSpacer(3)
      sfBadge = SFSymbol.named(`${d.inboxCount}.circle`)
      sfBadge.applyFont(Font.boldRoundedSystemFont(150))
      sfBadge.applyBoldWeight()
      badgeSymbolElement = headerStack.addImage(sfBadge.image)
      badgeSymbolElement.imageSize = new Size(20, 20)
      badgeSymbolElement.tintColor = Color.red()
  }
    
      bodyStack.addSpacer(7)
        
  let headerDescription = line3.addText(d.puplicDescription)
      headerDescription.font = Font.lightRoundedSystemFont(12)  
      headerDescription.textColor = txtColor
      headerDescription.textOpacity = 0.6
      headerDescription.lineLimit = 1
      headerDescription.minimumScaleFactor = 0.5
       
      bodyStack.addSpacer(10)
    
  let mainBodyStack = bodyStack.addStack()
      mainBodyStack.layoutVertically()
      
  let line4 = mainBodyStack.addText("Post Karma: " + d.postKarma)
      line4.font = Font.lightRoundedSystemFont(17)
      line4.textColor = txtColor
      
  let line5 = mainBodyStack.addText("Comment Karma: " + d.commentKarma)
      line5.font = Font.lightRoundedSystemFont(17)
      line5.textColor = txtColor
      
  let line6 = mainBodyStack.addText("Awarder Karma: " + d.awarderKarma)
      line6.font = Font.lightRoundedSystemFont(17)
      line6.textColor = txtColor
     
  let line7 = mainBodyStack.addText("Awardee Karma: " + d.awardeeKarma)
      line7.font = Font.lightRoundedSystemFont(17)
      line7.textColor = txtColor
          
      bodyStack.addSpacer()

    
      df.useShortTimeStyle()
  let footer = w.addText("Last Refresh " + df.string(new Date()))  
      footer.font = Font.lightRoundedSystemFont(11)
      footer.textColor = txtColor
      footer.textOpacity = 0.5
      footer.centerAlignText()
      
 return w
};
  

//Loads javascript module from github if needed
async function loadModule(){
  try {
     req = new Request('https://raw.githubusercontent.com/iamrbn/reddit-widget/main/redditModule.js')
     moduleFile = await req.loadString()
     fm.writeString(modulePath, moduleFile)
     console.warn('Loaded module file from github repo!')
  } catch (err){
     throw new Error('Failed to load module file from github repo!\n' + err.message) 
  }
};


//============ END OF SCRIPT ============\\
//=======================================\\
