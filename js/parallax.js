var jumboHeight = $('.jumbotron').outerHeight();
function parallax(){
    var scrolled = $(window).scrollTop();
    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
    $('.draft-retro').css('height', (jumboHeight-scrolled) + 'px');
    $('.power-of-veto').css('height', (jumboHeight-scrolled) + 'px');
    $('.not-so-fast').css('height', (jumboHeight-scrolled) + 'px');
    $('.the-day-i-said-what-if').css('height', (jumboHeight-scrolled) + 'px');
    $('.rd2-gm7').css('height', (jumboHeight-scrolled) + 'px');
}

$(window).scroll(function(e){
    parallax();
});