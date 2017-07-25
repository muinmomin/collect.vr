window.onload = function(){
  document.getElementById("content").style.display = "block";
  if(localStorage.getItem("screenshot")){
    //TODO: show the screenshot
    document.getElementById("content").style.display = "none";
    document.getElementById("screenshot").style.display = "block";
  } else {
    
  }
}
