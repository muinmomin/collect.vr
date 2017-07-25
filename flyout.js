(function () {
      browser.browserAction.onClicked.addListener((tab) => {
            alert('flyout');
      })
});