// (function () {
//       browser.browserAction.onClicked.addListener((tab) => {
//             alert('flyout');
//       })
// });

// alert('flyout2');
// alert('got jquery here too' + $("body").toString());
//$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'popup.css'));
// var div = window.document.createElement("div");
// var button = window.document.createElement("button");
// var text = window.document.createTextNode("test");
// button.appendChild(text);
// div.appendChild(button);
// div.style.cssText = "position:fixed; right:5%; top:5%; border:1;";
$(document).ready(function(){
      $('body').append("<div id='container' style='position:fixed; top:10px; right:10px;'>replaceme</div>")
      // $('#container').load('flyout.html');
      $('#container').html('<link rel="stylesheet" type="text/css" href="popup.css"><div id="main"><span id="your-space">collect.vr</span><img id="delete" src="assets/delete.png" /><img id="share" src="docs/assets/share.png" /><div id="screenshot"></div><div id="content"><span class="content-text">Your space is empty</span><img id="right-click-icon" src="docs/assets/RightClickIcon.png" /><div class="content-text content-text-small">Right click on content to add it to the space</div></div><div class="bottom-buttons"><button id="view"><img id="new-tab-icon" src="docs/assets/NewTabIcon.png" />View in browser</button></div><div class="bottom-buttons"><button id="launch-vr"><img id="web-vr-icon" src="docs/assets/WebVRicon.png" />Launch VR</button></div></div>')
      // $.get('flyout.html', function(data){
      //       alert(data);
      // });
})


// window.document.body.appendChild(div);

//    to get Jquery to work, add this to the manifest
//     "web_accessible_resources": [
//         "docs/assets/*"
//     ]