window.onload = function(){
  document.getElementById("content").style.display = "block";
  if(localStorage.getItem("screenshot")){
    //TODO: show the screenshot
    document.getElementById("content").style.display = "none";
    document.getElementById("screenshot").style.display = "block";
  } else {
    
  }

  document.getElementById('view').addEventListener('click', function(){
      var creating = browser.tabs.create({
                  url: 'vrTemplate/index.html'
      });
  });
}
