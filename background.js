(function () {

      var COLLECTION_KEY = 'collections';

      // Open first run (fake website) page on new install/update.
      browser.runtime.onInstalled.addListener((details) => {
            var creating = browser.tabs.create({
                  url: 'http://muin.me/collect.vr/'
            });
      });

      browser.contextMenus.create({
            id: 'collect',
            title: 'Collect',
            contexts: ['all']
      });

      function urlToBase64(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                        callback(reader.result);
                  }
                  reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
      }

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
            if (info.linkUrl !== undefined) {
                  obj['src'] = info.linkUrl;
                  obj['type'] = 'link';
                  if (arr[arr.length - 1] === 'gltf') {
                        obj['type'] = '3d';
                  }
            }
            else if (info.srcUrl !== undefined) {
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

            var collections = localStorage.getItem(COLLECTION_KEY) ? localStorage.getItem(COLLECTION_KEY) : '[]';
            var oldCollections = JSON.parse(collections);
            oldCollections.push(obj);
            localStorage.setItem(COLLECTION_KEY, JSON.stringify(oldCollections));
      });

})();