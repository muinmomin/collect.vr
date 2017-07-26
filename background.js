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

      browser.browserAction.onClicked.addListener((info) => {
            // alert('test');
            // alert('test2');
            // alert('test3' + window.document.body)
            // browser.tabs.executeScript(null, {file:"flyout.js"});
            
            browser.tabs.query({active:true}, function(tabs){
                  var tabId = tabs[0].id;
                  // alert('running flyout.js')
                  // browser.tabs.executeScript(tabId, {file:"flyout.js"})
                  
                  // browser.tabs.executeScript({
                  //       code: 'document.body.style.backgroundColor="red"'
                  // });
                  browser.tabs.executeScript(tabId, {
                        code: 'var div=window.document.createElement("div"),button=window.document.createElement("button"),text=window.document.createTextNode("test");button.appendChild(text),div.appendChild(button),div.style.cssText="position:fixed; right:5%; top:5%",window.document.body.appendChild(div);'
                  });
            })
            var button = window.document.createElement(button)
            var text = window.document.createTextNode("test");
            button.appendChild(text);
            window.document.body.appendChild(button);
      })
      
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

      browser.browserAction.onClicked.addListener((info) => {
            // alert('browserAction is working');
            // alert('found jquery ' + $("body").toString());
            browser.tabs.query({active:true}, function(tabs){
                  var tabId = tabs[0].id;
                  browser.tabs.executeScript(tabId, {file: "docs/assets/jquery-1.12.4.min.js"}, function(){
                        browser.tabs.executeScript(tabId, {file:"docs/flyout.js"})
                  });

                  // browser.tabs.executeScript({
                  //       code: 'document.body.style.backgroundColor="red"'
                  // });

                  // browser.tabs.executeScript(tabId, {
                  //       code: 'var div=window.document.createElement("div"),button=window.document.createElement("button"),text=window.document.createTextNode("test");button.appendChild(text),div.appendChild(button),div.style.cssText="position:fixed; right:5%; top:5%",window.document.body.appendChild(div);'
                  // });

            })
      })
>>>>>>> Stashed changes
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
            
            console.log(obj);

            var collections = localStorage.getItem(COLLECTION_KEY) ? localStorage.getItem(COLLECTION_KEY) : '[]';
            var oldCollections = JSON.parse(collections);
            oldCollections.push(obj);
            localStorage.setItem(COLLECTION_KEY, JSON.stringify(oldCollections));
      });

})();