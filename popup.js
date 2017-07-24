window.addEventListener('click',function(e){
  if(e.target.href !== undefined){
     var creating = browser.tabs.create({
             url: e.target.href
       });   //promise
  }
})