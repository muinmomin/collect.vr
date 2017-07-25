(function () {
      browser.browserAction.onClicked.addListener((tab) => {
            alert('flyout');
      })
});

//    to get Jquery to work, add this to the manifest
//     "web_accessible_resources": [
//         "docs/assets/*"
//     ]