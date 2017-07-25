window.onload = function(){
      var div = window.document.createElement("div");
      var button = window.document.createElement("button"); 
      var text = window.document.createTextNode("test");
      button.appendChild(text); 
      div.appendChild(button);
      div.style.cssText = "position:fixed; right:5%; top:5%; border:1;";
      window.document.body.appendChild(div);
};