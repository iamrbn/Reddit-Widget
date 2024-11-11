//=======================================//
//=========== START OF MODULE ===========//
//============= Version 1.0 =================//


// sends request to reddit-api
async function getKarmaFromAPI(numberFormatting){
  let df = new DateFormatter()
       df.dateFormat = 'MMMM dd, yyyy'
  let fm = FileManager.iCloud()
  let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
  let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
  let user, userData, postData;
  
  try {
     await fm.downloadFileFromiCloud(jsonPath)
     user = await JSON.parse(fm.readString(jsonPath))
     try {
        // get access-token for api request
        let reqToken = new Request('https://www.reddit.com/api/v1/access_token')
             reqToken.method = 'POST'
             reqToken.headers = {
                 'Authorization': 'Basic ' + btoa(user.CLIENT_ID + ":" + user.CLIENT_SECRET)
            }
             reqToken.body = `grant_type=password&username=${user.USERNAME}&password=${user.PASSWORD}`
                
             token = await reqToken.loadJSON()
             //console.warn(JSON.stringify(token, null, 1))
        
        // get user datas with token
        let reqUserData = new Request('https://oauth.reddit.com/api/v1/me')
             reqUserData.headers = {
                 'user-Agent': 'getKarmaFromRedditBy-iamrbn/v1.4',
                 'Authorization': `${token.token_type} ${token.access_token}`
            }
             
             userData = await reqUserData.loadJSON()
             //console.log(JSON.stringify(userData, null, 2))
         
        let reqPostData = new Request(`https://oauth.reddit.com/user/${ user.USERNAME }/overview/new/?limit=7`)
             reqPostData.headers = {
                 'user-Agent': 'getKarmaFromRedditBy-iamrbn/v1.4',
                 'Authorization': `${token.token_type} ${token.access_token}`
            }
             
             postData = await reqPostData.loadJSON()
             //console.log(JSON.stringify(postData, null, 2))
          
        let arr = []
        for (i = 0; i < postData.data.children.length; i++){
             arr.push(postData.data.children[i].data.created * 1000)
             //log(arr)// always the 3th number is the biggest?
             max = arr.reduce((a, b) => Math.max(a, b), -Infinity)
             idx = arr.reduce((idxMax, element, index) => element > arr[idxMax] ? index : idxMax, 0)
            }
             //console.warn(idx + ': ' + max)
             //idx += 1
             //console.log(postData.data.children[idx])
         
             //Declare account variables
             totalKarma = Intl.NumberFormat('en-EN', {notation:'compact', maximumSignificantDigits: 2}).format(userData.total_karma)
             postKarma = Intl.NumberFormat(numberFormatting).format(userData.link_karma)
             commentKarma = Intl.NumberFormat(numberFormatting).format(userData.comment_karma)
             awarderKarma = Intl.NumberFormat(numberFormatting).format(userData.awarder_karma)
             awardeeKarma = Intl.NumberFormat(numberFormatting).format(userData.awardee_karma)
             snoovatarImg = userData.snoovatar_img
             usertitle = userData.subreddit.title
             username = userData.subreddit.display_name_prefixed
             puplicDescription = userData.subreddit.public_description
             inboxCount = userData.inbox_count
             profileURL = "https://reddit.com"+userData.subreddit.url.slice(0, -1)
             profileCreated = df.string(new Date(userData.created*1000))
             minutesDiff = Math.floor((new Date(Date.now()).getTime() - new Date(userData.created * 1000).getTime()) / 1000 / 60)
             accountAge = (minutesDiff < 525600) ? Math.abs(minutesDiff/60/24).toFixed(0)+" d" : Math.abs(minutesDiff/60/24/365).toFixed(1)+" y"
             //console.log({snoovatarImg})
         
            //Declare post variables
             sub = postData.data.children[idx].data.subreddit_name_prefixed
             subURL = 'https://reddit.com/' + sub
             upvotes = Intl.NumberFormat(numberFormatting).format(postData.data.children[idx].data.score)
             downvotes = Intl.NumberFormat(numberFormatting).format(postData.data.children[idx].data.downs)
             numComments = Intl.NumberFormat(numberFormatting).format(postData.data.children[idx].data.num_comments)
             postCreated = df.string(new Date(postData.data.children[idx].data.created * 1000))
             kind = postData.data.children[idx].kind // 't1_' = comment / 't2_' = account  / 't3_' = link / 't4_' =  message / 't5_' = subreddit / 't6_' = award
             author = 'u/' + postData.data.children[idx].data.author
     
        if (kind.includes('t1')){ // comment
            title = postData.data.children[idx].data.link_title
            body = postData.data.children[idx].data.body.replace(/[\[\]]/g, '').replace(/\(.+?\)/g, '↗')
            link = postData.data.children[idx].data.link_permalink
            contentLink = postData.data.children[idx].data.link_url
            link_author = '‣ u/'  + postData.data.children[idx].data.link_author //of link post
            numCrossposts = ''
            url = ''
        } else if (kind.includes('t3')){ // link
            title = postData.data.children[idx].data.title
            body = postData.data.children[idx].data.selftext
            link = 'https://reddit.com' + postData.data.children[idx].data.permalink
            contentLink = postData.data.children[idx].data.preview.images[0].resolutions[5].url.split('?')[0]
            link_author = ''
            url = postData.data.children[idx].data.url + '↗'
            numCrossposts = Intl.NumberFormat(numberFormatting).format(postData.data.children[idx].data.num_crossposts)
        } 
        
        if (contentLink.includes('/gallery/')){
            let fullPostCommentData = await new Request(`https://www.reddit.com/r/${ postData.data.children[idx].data.subreddit }/comments/${ postData.data.children[idx].data.parent_id.split('_')[1] }/.json`).loadJSON()
                 mediaID = fullPostCommentData[0].data.children[0].data.gallery_data.items[0].media_id
                 mediaURL = fullPostCommentData[0].data.children[0].data.media_metadata[mediaID].p[5].u
                 contentLink = mediaURL.replaceAll('&amp;', '&')
        }
     
            timeDiff = Math.floor((new Date(Date.now()).getTime() - new Date(postData.data.children[idx].data.created * 1000).getTime()) / 1000 / 60)
            postAge = "--"
        if (timeDiff > 525600) postAge = Math.abs(timeDiff/60/24/365).toFixed(1)+"y"
        else if (timeDiff > 1440) postAge = Math.abs(timeDiff/60/24).toFixed(0)+"d"
        else if (timeDiff > 60) postAge = Math.abs(timeDiff/60).toFixed(0)+"h"
        else if (timeDiff >= 1) postAge= Math.abs(timeDiff).toFixed(0)+"m"
         
         } catch(err){
             console.error('ERROR: No response from reddit API')
        }
    } catch(err){
         console. error('ERROR: Failed to load user credentials from icloud')
    }
         
    return {
        totalKarma,
        postKarma,
        commentKarma,
        awarderKarma,
        awardeeKarma,
        snoovatarImg,
        usertitle,
        username,
        puplicDescription,
        inboxCount,
        profileURL,
        profileCreated,
        minutesDiff,
        accountAge,
        sub,
        subURL,
        upvotes,
        downvotes,
        numComments,
        postCreated,
        kind,
        author,
        title,
        body,
        link,
        link_author,
        contentLink,
        numCrossposts,
        url,
        timeDiff,
        postAge
    }
};


 // Save images from github and appstore
async function saveAllImages(imgKey, snoovatarImg){
      //log({profileImg})
      let fm = FileManager.iCloud()
      let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      let imgURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Images/'
      let imgs = ["karma.png", "cakedayConfetti.png", "cakedayApollo.png", "cakedayReddit.png", "alienblue.png", "black.png", "classic.png", "orange.png", "oldReddit.png", "arrowsLS.png", "redditLS.png"]
      let appStoreIcons = {
          apollo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a1/d8/a6/a1d8a63c-1534-2a04-b0fe-3de6e9c800b9/AppIcon-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-85-220.png/512x512bb.png'
          }
          
      for (img of imgs){
             imgPath = fm.joinPath(dir, img)
             if (!fm.fileExists(imgPath)){
                console.warn("Loading image: " + img)
                request = new Request(imgURL + img)
                image = await request.loadImage()
                fm.writeImage(imgPath, image)
            }
       }
     
      for (appIcon in appStoreIcons){
            iconName = appIcon + ".png"
            imgPath = fm.joinPath(dir, iconName)
            //console.log(iconName + " already exists in iCloud")
            if (!fm.fileExists(imgPath)){
                console.warn("loading image: " + iconName)
                req = new Request(appStoreIcons[appIcon])
                img = await req.loadImage()
                m.writeImage(imgPath, img)
            }
        }
     
      imgName = snoovatarImg.match(/snoovatar.*/)[0].replace('/avatars/', '_').replace('.png', '')
      //log({imgName})
      
      if (!imgKey.contains("nameProfileImage")){
            imgKey.set("nameProfileImage", imgName)
        }
      if (imgKey.get("nameProfileImage") != imgName){
            imgPathOld = fm.joinPath(dir, imgKey.get("nameProfileImage") + '.png')
            try {
                    fm.remove(imgPathOld)
                    await popUp("DELETED SUCCESSFULLY!" ,fm.fileName(imgPathOld, true))
                    imgKey.set("nameProfileImage", imgName)
                    await presentMenu()
               } catch(err){
                    console.error(err.message)
               }
        }
      
         imgPath = fm.joinPath(dir, imgName + '.png')
         imgFileName = fm.fileName(imgPath, true)
      if (!fm.fileExists(imgPath)){
          console.warn("Loading & Saving Current Profile Image: " + imgName + '.png')
          img = await new Request(snoovatarImg).loadImage()
          fm.writeImage(imgPath, img)
      }
}; 

    
function addString(stack, image, radius, size, text, txtSize, txtOpacity){
      let txtColor = Color.dynamic(Color.black(), Color.white())
      let wImg = stack.addImage(image)
          wImg.cornerRadius = radius
          wImg.imageSize = new Size(size, size)
          stack.addSpacer(0.5)
      let wTxt = stack.addText(text)
          wTxt.font = Font.lightRoundedSystemFont(txtSize)
          wTxt.textColor = txtColor
          wTxt.textOpacity = txtOpacity
    };
    
    
function addText(stack, text, size, opacity){
      let txtColor = Color.dynamic(Color.black(), Color.white())
      let wTxt = stack.addText(text)
          wTxt.font = Font.lightRoundedSystemFont(size)
          wTxt.textColor = txtColor
          wTxt.textOpacity = opacity
    };
    

// creating menu for start script
async function presentMenu(api, username, totalKarma, accountAge, inboxCount, imgKey){
  let alrt = new Alert()
      alrt.title = username
      alrt.message = `${totalKarma} Total Karma\nRedditor Since ${accountAge}\nUnread Inbox: ${inboxCount}`
      alrt.addDestructiveAction("⌦ Delete Menu")
      alrt.addAction('⚙︎ Report Bug')
      alrt.addCancelAction("Cancel")
      idx = await alrt.presentSheet()
      if (idx === 0) await deleteUserDatas(imgKey)
      else if (idx === 1) await reportBug(api)
};


//Asks for user login datas to save in iCloud ~ iCloud/Scriptable/Reddit-Widget
async function askForLoginDatas(){
      let fm = FileManager.iCloud()
      let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
      let alert = new Alert()
           alert.title = "No Data Found in iCloud!"
           alert.message = "Please Enter Login Datas"
           alert.addTextField('Username')
           alert.addTextField("Password")
           alert.addTextField("Client ID")
           alert.addTextField("Client Secret")
           alert.addAction("Save")
           alert.addDestructiveAction("Cancel")
           alert.addAction("Documentation ↗")
      idx = await alert.present()
      if (idx === 0){
         userDatas = {
           USERNAME: alert.textFieldValue(0).replace('u/', ''),
           PASSWORD: alert.textFieldValue(1),
           CLIENT_ID: alert.textFieldValue(2),
           CLIENT_SECRET: alert.textFieldValue(3)
         }
         checkObj = Object.values(userDatas).every(value => value !== "" && value.length > 3)
         if (checkObj){
             FileManager.iCloud().writeString(jsonPath, JSON.stringify(userDatas, null, 1))
             await popUp('SUCCESSFULLY SAVED!', '~ iCloud/Scriptable/Reddit-Widget/LoginDatas.json')
         } else {
            await popUp('ERROR: Input Too Short!', 'Please Try Again')
            await askForLoginDatas()
        }
     } else if (idx === 1){
         throw new Error('User Clicked "Cancel!"')
     } else if (idx === 2){
         Safari.openInApp('https://github.com/iamrbn/Reddit-Widget/#create-personal-reddit-appscript', false)
    }
};


//Delete Menu
async function deleteUserDatas(imgKey){
  let fm = FileManager.iCloud()
  let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
  let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
  let alert = new Alert()
      alert.title = "Are You Sure To Delete?"
      alert.message = "Removed files can NOT be restored"
      alert. addDestructiveAction("Profile Image")
      alert. addDestructiveAction("User Credentials")
      alert.addCancelAction("Cancel")
  let idx = await alert.present()
  if (idx === 0){
     try {
       // Delete Profile Image
       fm.remove(dir + '/' + imgKey.get("nameProfileImage") + '.png')
       await popUp("DELETED SUCCESSFULLY!", fm.fileName(dir + '/' + imgKey.get("nameProfileImage") + '.png', true))
       imgKey.remove("nameProfileImage")
       console.warn('User Deleted Profile Image')
     } catch(err){
       if (err.message.includes('snoovatar_')){
        imgKey.remove("nameProfileImage")
       }
       throw new Error(err.message)
     }
  } else if (idx === 1){
     try {
       // Delete Login Datas
       fm.remove(jsonPath)
       await popUp("DELETED SUCCESSFULLY!", fm.fileName(jsonPath, true))
       console.warn('User Deleted Login Datas')
     } catch(err){
       throw new Error(err.message)
     }
  }
};


async function scndAlert(){
        filesList = fm.listContents(dir).toString().replaceAll(",", "\n").replaceAll(".icloud", "").replaceAll(/^[.]/gm, '');
        logWarning(filesList)
        scndAlrt = new Alert()
        scndAlrt.title = "Are You Really Sure?"
        scndAlrt.message = "Removed files can NOT be restored\n\n" + filesList
        scndAlrt.addDestructiveAction("Yes, Delete Everything!");
        scndAlrt.addCancelAction("Nope, I'm Out")
        let idx = await scndAlrt.present()
        if (idx === 0){
            fm.remove(dir+'/'+imgKey.get("nameProfileImage")+'.png')
            await popUp("Deleted Sucessfully", fm.fileName(dir+'/'+imgKey.get("nameProfileImage")+'.png', true))
        } else if (idx === -1){
            await presentMenu()
        }
    };


async function reportBug(api){
    fm = FileManager.iCloud()
    dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
    bugPath = fm.joinPath(dir, 'apiResponse_'+Date.now()+'.json')

    info = new Alert()
    info.title = "This function saves your API response in the Reddit-Widget folder"
    info.message = "Please contact the script owner via GitHub issue"
    info.addAction("Continue")
    info.addCancelAction("Cancel")
    idx = await info.presentSheet()
    if (idx === 0){
        FileManager.iCloud().writeString(bugPath, JSON.stringify(api, null, 2))
        await popUp('Successfully Saved File', '~ '+bugPath)
        Safari.open('https://github.com/iamrbn/Reddit-Widget/issues/')
    } else {
        console.warn('>> USER CLICKED CANCEL')
    }
};


async function popUp(title ,message){
      alrt = new Alert()
      alrt.title = title
      alrt.message = message
      alrt.addAction("OK")
      await alrt.presentAlert()
};


//creates background of widget
async function createBG(base, dock, url){
    try {
        base.backgroundImage = await new Request(url).loadImage()
    } catch(err){
        //console.warn('Error creating widget background:\nNo image from the specified URL could be loaded. Maybe there is no usable image from the last post!')
    } finally {
            bgGradient = new LinearGradient()
            top = Color.dynamic(new Color('#FFFFFF'), new Color('#FF8420'))
            top2 = Color.dynamic(new Color('#FFFFFF'), new Color('#FF5304'))
            middle = Color.dynamic(new Color('#EDEDED'), new Color('#FD3F12'))
            bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#EA2128'))
            location = [0, 0.8, 1]
            color = [top, middle, bottom]
            
             if (dock){
                location = [0, 0.33, 0.63, 1]
                color = [bottom, middle, middle, top2]
            }
             
            bgGradient.locations = location
            bgGradient.colors = color
            base.backgroundGradient = bgGradient
        }
};


// get image from icloud ~iCloud/Scriptable/Reddit-Widget
async function getImageFor(name){
      fm = FileManager.iCloud()
      dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      imgPath = fm.joinPath(dir, name + '.png')
      await fm.downloadFileFromiCloud(imgPath)
      
 return await fm.readImage(imgPath)
};
    

// creating error widget (first run or no datas saved)
async function errorWidget(bgGradient, padding, radius, size1, size2){
      let errWidget = new ListWidget()
           errWidget.url = "scriptable:///run/Reddit%20Widget"
           errWidget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 15)
           errWidget.setPadding(padding, padding, padding, padding)
           await rModule.createBG(errWidget, false, null)
          
           errWidget.addText("Couldn’t find login datas - Looks like your first run").font = Font.boldMonospacedSystemFont(size1)
            
           errWidget.addSpacer()
         
           errWidget.addText("Please open the script and enter your login datas or visit").font = Font.regularMonospacedSystemFont(size2)
            
           errWidget.addSpacer()
      
      let linkButton = errWidget.addStack()
           linkButton.setPadding(7, 0, 7, 0)
           linkButton.backgroundColor = Color.white()
           linkButton.cornerRadius = radius
           linkButton.centerAlignContent()
           linkButton.url = 'https://github.com/iamrbn/Reddit-Widget/'
            
          linkButton.addSpacer();
        
      let wURL = linkButton.addText("GitHub Repo ↗")
           wURL.font = Font.semiboldMonospacedSystemFont(size2)
           wURL.textColor = Color.blue()
           wURL.centerAlignText()
            
          linkButton.addSpacer()
        
  return errWidget
};

    
//Checks if's there an server update on GitHub available
async function updateCheck(fm, modulePath, version){
  fm = fm = FileManager.iCloud()
  url = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/'
  endpoints = ['Reddit-Widget.js', 'redditModule.js']
  let uC;
  
  try {
      updateCheck = new Request(url + endpoints[0] + 'on')
      uC = await updateCheck.loadJSON()
    } catch (err){
       return log(err.message)
    }

  needUpdate = false
  if (uC.version > version){
     needUpdate = true
    if (config.runsInApp){
      //console.error(`New Server Version ${uC.version} Available`)
      let newAlert = new Alert()
           newAlert.title = `New Server Version ${uC.version} Available!`
           newAlert.addAction("OK")
           newAlert.addDestructiveAction("Later")
           newAlert.message="Changes:\n" + uC.notes + "\n\nOK starts the download from GitHub\n More informations about the update changes go to the GitHub Repo"
      if (await newAlert.present() === 0){
        reqCode = new Request(url + endpoints[0])
        updatedCode = await reqCode.loadString()
        pathCode = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        fm.writeString(pathCode, updatedCode)
        reqModule = new Request(url + endpoints[1])
        moduleFile = await reqModule.loadString()
        fm.writeString(modulePath, moduleFile)
        throw new Error("Update Complete!")
      }
    }
  } else {
      console.log(">> SCRIPT IS UP TO DATE!")
  }
  return {uC, needUpdate}
};


module.exports = {
    getKarmaFromAPI,
    updateCheck,
    getImageFor,
    presentMenu,
    askForLoginDatas,
    deleteUserDatas,
    reportBug,
    scndAlert,
    popUp,
    createBG,
    saveAllImages,
    addString,
    errorWidget,
    addText
};

//=========================================//
//============== END OF MODULE ============//
//=========================================//
