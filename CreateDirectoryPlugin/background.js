var idTimeout = null;

const clearBadge = (seconds) => {
  clearTimeout(idTimeout); /**Not matter if the timeout exprired that doesnt have effect */
  idTimeout = setTimeout(setBadgeText, seconds*1000);
}

const setBadgeColor = (appStatus) => {
  let colorRGB = '#000';
  appStatus = appStatus==='ERR'? '#AF4448' : appStatus==='VOID'? '#707070' : '#087F23'; 
  chrome.browserAction.setBadgeBackgroundColor({color: appStatus});
}

const setBadgeText = (text='') => {
  chrome.browserAction.setBadgeText({text});
}

chrome.browserAction.onClicked.addListener( tab => {
  clearBadge(0);
    chrome.tabs.sendMessage(tab.id, {action: 'getTheTagsFromDOM'}, response => {
      setBadgeText(response.messageDidSend);
      setBadgeColor(response.messageDidSend);
      clearBadge(10);
    });
});
