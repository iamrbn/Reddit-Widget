//=======================================//
//=========== START OF MODULE ===========//
//============= Version 0.9 =================//


// sends request to reddit-api
async function getKarmaFromAPI(numberFormatting){
  let df = new DateFormatter()
       df.dateFormat = 'MMMM dd, yyyy'
  let fm = FileManager.iCloud()
  let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
  let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
  let user, data
  
  try {
     await fm.downloadFileFromiCloud(jsonPath)
     user = await JSON.parse(fm.readString(jsonPath))
     try {
        // Get Access-Token for json api request
        let reqToken = new Request('https://www.reddit.com/api/v1/access_token')
             reqToken.method = 'POST'
             reqToken.headers = {
                 'Authorization': 'Basic ' + btoa(user.CLIENT_ID + ":" + user.CLIENT_SECRET)
            }
             reqToken.body = `grant_type=password&username=${user.USERNAME}&password=${user.PASSWORD}`
                
             token = await reqToken.loadJSON()
             //console.warn(JSON.stringify(resToken, null, 1))
        
        // Get user-profile json from api/v1/me
        let reqDatas = new Request('https://oauth.reddit.com/api/v1/me')
             reqDatas.headers = {
                 'user-Agent': 'getKarmaFromRedditBy-iamrbn/v1.4',
                 'Authorization': `${token.token_type} ${token.access_token}`
            }
             
             data = await reqDatas.loadJSON()
             //console.log(JSON.stringify(data, null, 2))
         
        let reqDatas2 = new Request(`https://oauth.reddit.com/user/${ user.USERNAME }/overview/new/?limit=7`)
             reqDatas2.headers = {
                 'user-Agent': 'getKarmaFromRedditBy-iamrbn/v1.4',
                 'Authorization': `${token.token_type} ${token.access_token}`
            }
             
             data2 = await reqDatas2.loadJSON()
             //console.log(JSON.stringify(data2, null, 2))
          
        let arr = []
        for (i=0; i<data2.data.children.length; i++){
             arr.push(data2.data.children[i].data.created * 1000)
             //log(arr)// always the 3th number is the biggest?
             max = arr.reduce((a, b) => Math.max(a, b), -Infinity)
             idx = arr.reduce((idxMax, element, index) => element > arr[idxMax] ? index : idxMax, 0)
           }
           //console.warn(idx + ': ' + max)
           //console.log(data2.data.children[idx])
     
     //Declare variables account
     totalKarma = Intl.NumberFormat('en-EN', {notation:'compact', maximumSignificantDigits: 2}).format(data.total_karma)
     postKarma = Intl.NumberFormat(numberFormatting).format(data.link_karma)
     commentKarma = Intl.NumberFormat(numberFormatting).format(data.comment_karma)
     awarderKarma = Intl.NumberFormat(numberFormatting).format(data.awarder_karma)
     awardeeKarma = Intl.NumberFormat(numberFormatting).format(data.awardee_karma)
     profileImg = data.icon_img.split('?')
     snoovatarImg = data.snoovatar_img //full view of profile image
     usertitle = data.subreddit.title
     username = data.subreddit.display_name_prefixed
     puplicDescription = data.subreddit.public_description
     inboxCount = data.inbox_count //post inbox
     profileURL = "https://reddit.com"+data.subreddit.url.slice(0, -1)
     profileCreated = df.string(new Date(data.created*1000))//date of creating account
     minutesDiff = Math.floor((new Date(Date.now()).getTime() - new Date(data.created * 1000).getTime()) / 1000 / 60)
     accountAge = (minutesDiff < 525600) ? Math.abs(minutesDiff/60/24).toFixed(0)+" d" : Math.abs(minutesDiff/60/24/365).toFixed(1)+" y"
     //console.log({profileImg})

     //Declare variables post
     subreddit = data2.data.children[idx].data.subreddit_name_prefixed
     subURL = 'https://reddit.com/' + subreddit
     body = data2.data.children[idx].data.body.replace(/[\[\]]/g, '').replace(/\(.+?\)/g, '↗')
     kind = data2.data.children[idx].kind // 't1_' = comment / 't3_' = post
     linkAuthor = data2.data.children[idx].data.link_author // Author of main post or comment
     author = data2.data.children[idx].data.author //Author of comment / answer
     postAuthor = (kind.includes('t1')) ?  author : linkAuthor
     link = data2.data.children[idx].data.link_permalink
     contentLink = data2.data.children[idx].data.link_url
     score = Intl.NumberFormat(numberFormatting).format(data2.data.children[idx].data.score)
     downvotes = Intl.NumberFormat(numberFormatting).format(data2.data.children[idx].data.downs)
     title = data2.data.children[idx].data.link_title
     numComments = Intl.NumberFormat(numberFormatting).format(data2.data.children[idx].data.num_comments)
     postCreated = df.string(new Date(data2.data.children[idx].data.created * 1000))
     timeDiff = Math.floor((new Date(Date.now()).getTime() - new Date(data2.data.children[idx].data.created * 1000).getTime()) / 1000 / 60)
     postAge = "--"
     if (timeDiff > 525600) postAge = Math.abs(timeDiff/60/24/365).toFixed(1)+"y"
     else if (timeDiff > 1440) postAge = Math.abs(timeDiff/60/24).toFixed(0)+"d"
     else if (timeDiff > 60) postAge = Math.abs(timeDiff/60).toFixed(0)+"h"
     else if (timeDiff >= 1) postAge= Math.abs(timeDiff).toFixed(0)+"m"
         } catch(error){
             console.warn(error.message)
        }
    } catch(error){
         console.warn(error.message)
    }
         
    return {
        totalKarma,
        postKarma,
        commentKarma,
        awarderKarma,
        awardeeKarma,
        profileImg,
        snoovatarImg,
        usertitle,
        username,
        puplicDescription,
        inboxCount,
        profileURL,
        profileCreated,
        minutesDiff,
        accountAge,
        // post content //
        subreddit,
        subURL,
        body,
        kind,
        linkAuthor,
        author,
        postAuthor,
        link,
        contentLink,
        score,
        downvotes,
        title,
        numComments,
        postCreated,
        timeDiff,
        postAge
    }

};


 // Save images from github and appstore
async function saveAllImages(imgKey, profileImg){
      //log({profileImg})
      let fm = FileManager.iCloud()
      let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      let imgURL = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/Images/'
      let imgs = ["karma.png", "cakedayConfetti.png", "cakedayApollo.png", "cakedayReddit.png", "alienblue.png", "black.png", "classic.png", "orange.png", "roundorange.png", "oldReddit.png", "arrowsLS.png", "redditLS.png"]
      let appStoreIcons = {
          reddit: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/90/cb/74/90cb74af-55b2-f44e-8e15-0555c7b8beee/AppIcon-0-0-1x_U007epad-0-0-85-220.png/512x512bb.png',
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
     
      imgName = profileImg[0].match(/snoovatar.*/)[0].replace('/avatars/', '_').replace('-headshot.png', '');
      //log({imgName})
      if (!imgKey.contains("nameProfileImage")){
            imgKey.set("nameProfileImage", imgName)
        }
      if (imgKey.get("nameProfileImage") != imgName){
            await profileImageChecker()
        }
      
     async function profileImageChecker(){
      let imgPath = fm.joinPath(dir, imgKey.get("nameProfileImage") + '.png')
      let alert = new Alert()
           alert.title = "Looks Like you’ve changed your Snoovatar"
           alert.message = "Do you want to change it in the widget, too?\nNo, means you have to delete it manually via 'Delete Menu ⌦'"
           alert.addAction("Yes")
           alert.addCancelAction("Nope, I'll do it later on my own")
           idx = await alert.present()
           if (idx == 0){
               fm.remove(imgPath)
               await rModule.popUp("DELETED SUCCESSFULLY!" ,fm.fileName(imgPath, true))
          } else if (idx == -1){
               await presentMenu()
          }
          
        imgKey.set("nameProfileImage", imgName)
      }
      
         imgPath = fm.joinPath(dir, imgName + '.png')
         imgFileName = fm.fileName(imgPath, true)
      if (!fm.fileExists(imgPath)){
          logWarning("Loading & Saving Current Profile Image")
          req = new Request(profileImg[0])
          image = await req.loadImage()
          fm.writeImage(imgPath, image)
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
async function presentMenu(username, totalKarma, inboxCount, imgKey){
  let alrt = new Alert()
      alrt.title = username
      alrt.message = `${totalKarma} Total Karma\nUnread Inbox: ${inboxCount}`
      alrt.addDestructiveAction("⌦ Delete Menu")
      alrt.addCancelAction("Cancel")
      idx = (await alrt.presentSheet() === 0) ? await deleteUserDatas(imgKey) : null
};


//Asks for user login datas to save in iCloud ~ iCloud/Scriptable/Reddit-Widget
async function askForLoginDatas(){
      let fm = FileManager.iCloud()
      let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      let jsonPath = fm.joinPath(dir, 'LoginDatas.json')
      let alert = new Alert()
           alert.title = "No Data Found in iCloud!"
           alert.message = "Please Enter Login Datas"
           //alert.message = "~ iCloud/Scriptable/Reddit-Widget/LoginDatas.json"
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
      alert.title = "Are You Sure to Delete Your Datas?"
      alert.message = "Removed files can NOT be restored"
      alert.addAction("Profile Image")
      alert.addAction("Login Datas")
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


async function popUp(title ,message){
      alrt = new Alert()
      alrt.title = title
      alrt.message = message
      alrt.addAction("OK")
        
      await alrt.presentAlert()
};
    
    
//Loads image from given url
async function loadImage(imgURL){
    return await new Request(imgURL).loadImage()
};


// get image from icloud ~iCloud/Scriptable/Reddit-Widget
async function getImageFor(name){
      let fm = FileManager.iCloud()
      let dir = fm.joinPath(fm.documentsDirectory(), 'Reddit-Widget')
      imgPath = fm.joinPath(dir, name + ".png")
      await fm.downloadFileFromiCloud(imgPath)
      img = await fm.readImage(imgPath)
      
 return img
};
    

// creating error widget (first run or no datas saved)
async function errorWidget(bgGradient, padding, radius, size1, size2){
      let errWidget = new ListWidget()
           errWidget.url = "scriptable:///run/Reddit%20Widget"
           errWidget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 15)
           errWidget.setPadding(padding, padding, padding, padding)
           errWidget.backgroundGradient = bgGradient
          
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
  let url = 'https://raw.githubusercontent.com/iamrbn/Reddit-Widget/main/'
  let endpoints = ['Reddit-Widget.js', 'redditModule.js']
  let uC
  
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
    scndAlert,
    popUp,
    loadImage,
    saveAllImages,
    addString,
    errorWidget,
    addText
};

//=========================================//
//============== END OF MODULE ============//
//=========================================//
