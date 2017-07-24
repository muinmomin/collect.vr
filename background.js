(function(){

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
      // check if collections is defined in local storage
      if(!localStorage)
      {
            alert("Browser not supported!");
            return;
      }
      

      if (info.srcUrl !== undefined) {
            var arr = info.srcUrl.split('.');
            var type = "2d"
            if (arr[arr.length-1] === 'gltf') {
                  type = "3d";
            }
            alert(info.srcUrl + ": " + type);
      }
      else if (info.linkUrl !== undefined) {
            alert(info.linkUrl);     
      }
      else if (info.selectionText !== undefined) {
            alert(info.selectionText);
      }
      else {

      }
});

})();