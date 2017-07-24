browser.runtime.onInstalled.addListener((details) => {
      var creating = browser.tabs.create({
             url: "firstrun.html"
       });
});

browser.contextMenus.create({
    id: "collect",
    title: "Collect",
    contexts: ['all']
});

browser.contextMenus.onClicked.addListener((info, tab) => {
      if (info.linkUrl !== undefined) {
            alert(info.linkUrl);     
      }
      else if (info.srcUrl !== undefined) {
            alert(info.srcUrl);
      }
      else if (info.selectionText !== undefined) {
            alert(info.selectionText);
      }
      else {

      }
});