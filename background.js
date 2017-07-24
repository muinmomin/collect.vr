(function () {

      var COLLECTION_KEY = 'collections';

      browser.runtime.onInstalled.addListener((details) => {
            var creating = browser.tabs.create({
                  url: 'firstrun.html'
            });
      });

      browser.contextMenus.create({
            id: 'collect',
            title: 'Collect',
            contexts: ['all']
      });

      // Captures data from right click and saves to local storage.
      browser.contextMenus.onClicked.addListener((info, tab) => {

            if (!localStorage) {
                  alert('Browser not supported!');
                  return;
            }

            var obj = {};
            obj['id'] = new Date().getTime();
            obj['ref'] = info.pageUrl;
            obj['type'] = '';
            obj['src'] = '';
            if (info.srcUrl !== undefined) {
                  obj['src'] = info.srcUrl;
                  var arr = obj['src'].split('.');
                  if (arr[arr.length - 1] === 'gltf') {
                        obj['type'] = '3d';
                  }
                  else {
                        obj['type'] = '2d';
                  }
            }
            else if (info.selectionText !== undefined) {
                  obj['src'] = info.selectionText;
                  obj['type'] = 'text';
            }
            else if (info.linkUrl !== undefined) {
                  obj['src'] = info.linkUrl;
                  obj['type'] = 'link';
            }
            console.log(obj);
            
            if (!localStorage.getItem(COLLECTION_KEY)) {

            }

            var collections = localStorage.getItem(COLLECTION_KEY) ? localStorage.getItem(COLLECTION_KEY) : [];
            collections.push(obj);
            localStorage.setItem(COLLECTION_KEY, collections);
      });

})();