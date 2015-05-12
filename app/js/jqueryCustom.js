var $j = jQuery.noConflict();
$j(function () {
    $j('.carousel').carousel();
    $j('.fadeIn').fadeIn('slow', function () {
    	 $j('.fadeIn').css('display','block');
    });
});