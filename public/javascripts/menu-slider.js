$(document).ready(function(){
	// STEP 5: Disable CSS interaction (see CSS above)
	$("div nav").removeClass("slideOut");
	// STEP 6: Set variable to track state of nav panel
	var navOpen = false
	// STEP 7: Build onclick handler, with if/else for open/shut
	$("div nav > a").on('click', function(event){
		// STEP 8: Disable default behaviour for hyperlink
		event.preventDefault(); 
		if (!navOpen){
			// STEP 9: Climb up the DOM and slide open the nav element
			$(this).parent().stop().animate({left: -100}, 500, "easeOutElastic", function(){
				// STEP 10: Callback function to add class to arrow once nav element is done animating
				$(this).children().first().addClass("rotated");
				// STEP 11: Proceed to CSS above and add class with transform and transition
			});              
			navOpen = true;
		} else {
			// STEP 12: Do the reverse of STEP 9 and slide shut the nav element
			$(this).parent().stop().animate({left: -300}, 500, "easeOutElastic", function(){
				$(this).children().first().removeClass("rotated");
			});
		navOpen = false;
		};
	});
});