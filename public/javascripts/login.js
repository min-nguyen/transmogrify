
function docReady(){
"use strict";

/*==================================================================
[ Validate ]*/
var input = $('.validate-input .input');

var box = document.querySelector('.site').children[0],
            panelClassName = 'show-front',
onButtonClick = function( event ){
  box.removeClassName( panelClassName );
  panelClassName = event.target.className;
  box.addClassName( panelClassName );
};


$('#arrow-login').hover(
    function(){
        $(this).addClass('bounce');
    }, function(){
        $(this).removeClass('bounce');
    })
$('#arrow-login').click(function(){
    $('#cube').addClass('show-right');
    $('#cube').removeClass('show-front');    
    $(".site").fadeTo(1000, 0.1, function(){
        $(".site").fadeTo(1000, 1);
    });
})
$('#arrow-create-account').hover(
    function(){
        $(this).addClass('bounce');
    }, function(){
        $(this).removeClass('bounce');
    })
$('#arrow-create-account').click(function(){
    $('#cube').addClass('show-front');
    $('#cube').removeClass('show-right');    
    $(".site").fadeTo(1000, 0.1, function(){
        $(".site").fadeTo(1000, 1);
    });
})



$('.validate-form').on('submit',function(){
    var check = true;

    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            check=false;
        }
    }
    return check;
});


$('.validate-form .input').each(function(){
    $(this).focus(function(){
        hideValidate(this);
    });
});


function validate (input) {
    if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if($(input).val().trim() == ''){
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}

/*==================================================================
[ Show pass ]*/
var showPass = 0;
$('.btn-show-pass').on('click', function(){
    if(showPass == 0) {
        $(this).next('input').attr('type','text');
        $(this).find('i').removeClass('fa-eye');
        $(this).find('i').addClass('fa-eye-slash');
        showPass = 1;
    }
    else {
        $(this).next('input').attr('type','password');
        $(this).find('i').removeClass('fa-eye-slash');
        $(this).find('i').addClass('fa-eye');
        showPass = 0;
    }
    
});
};

var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".site", { perspective: 5000 });
TweenMax.set(".container", {
  transformStyle: "preserve-3d",
  transformOrigin: "-0% 50%"
});
TweenMax.set("#page_2", { rotationY: 90, z: -siteW / 2, x: siteW / 2 });

function changeContent(){
    var tlFlip = new TimelineMax({
        yoyo: false,
        delay: 1.5,
        repeatDelay: 2
      });
      
      tlFlip
        .to(".site", 0.5, { scale: 0.8, ease: Power2.easeInOut }, "start")
        .to(
          ".container",
          0.4,
          { rotationY: -90, z: -siteW, ease: Power2.easeInOut },
          "start+=0.7"
        )
        .to(".site", 0.5, { scale: 1, ease: Power2.easeInOut }, "start+=1.2");
}
