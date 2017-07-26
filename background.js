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

      //Wraps text in canvas object 
      function wrapText(context, text, x, y, maxWidth, lineHeight, color) {
            context.fillStyle = color;
            var words = text.split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                  var testLine = line + words[n] + ' ';
                  var metrics = context.measureText(testLine);
                  var testWidth = metrics.width;
                  var linenum = 0;
                  if (testWidth > maxWidth && n > 0) {
                        context.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                  }
                  else {
                        line = testLine;
                  }
            }
            context.fillText(line, x, y);
      }

      //Takes in string and outputs url to png
      function txtToImg(selString) {
            //Creates canvas element
            var canv = document.createElement('canvas');
            canv.setAttribute("type", "hidden");
            canv.id = 'canvas';
            canv.width = 500;
            canv.height = 500;
            canv.style.position = "absolute";
            document.body.appendChild(canv);
            var ctx = canv.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canv.width, canv.height);

            //Puts text on canvas element
            ctx.font = "25px Segoe UI Semibold";
            var mwidth = canv.width - 50;
            var y = 35;
            var x = (canv.width - mwidth) / 2;
            var height = 25;
            var color = "black"
            wrapText(ctx, selString, x, y, mwidth, height, color);
            var url = canv.toDataURL("image/png");

            return url;
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
                  obj['src'] = txtToImage(info.selectionText);
                  obj['type'] = 'text';
            }

            var collections = localStorage.getItem(COLLECTION_KEY) ? localStorage.getItem(COLLECTION_KEY) : '[]';
            var oldCollections = JSON.parse(collections);
            oldCollections.push(obj);
            localStorage.setItem(COLLECTION_KEY, JSON.stringify(oldCollections));
      });

})();