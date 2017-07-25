$(document).ready(function() {
	setTimeout(animateTitle, 0);
	setTimeout(animateLogo, 2000);
	setTimeout(animateTagline, 3000);
	setTimeout(animateGetstarted, 4000);

	$('.getstarted').click(function() {
	console.log("click");
	$('.getstarted').removeClass("getstarted-activate");
	$('.content').removeClass("displaynone");
	setTimeout(animateContent, 1000);
	})
});

var animateTitle = function() {
	$('.maintitle').addClass("title-activate");
}

var animateLogo = function() {
	$('.logo').addClass("logo-activate");
}
var animateTagline = function() {
	$('.tagline').addClass("tagline-activate");
}
var animateGetstarted = function() {
	$('.getstarted').addClass("getstarted-activate");
}
var animateContent = function() {
	$('.content').addClass("content-activate");
}