$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});


//* ############ SIGN UP FORM ############ *//
var signUpForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var displayNameInput = document.getElementById("display-name-input");

authenticateUser();

$("#signup_submit").on("click",function(){
   signup();
})

// signUpForm.addEventListener("submit", function() {
function signup(){
    if(displayNameInput.value.length == 0){
        alert("You must enter a display name to continue!");
    }else{
        register();
    }
}

function register(){
    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(user) {
            console.log(displayNameInput.value);
            return user.updateProfile({
                displayName: displayNameInput.value,
            });
        })
        .then(function() {
            window.location.href = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
}


function authenticateUser(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        console.log("authentication called");
        if (currUser) {
            // User is signed in.
            window.location = "index.html";
        }
    });
}
//* ############ END OF SIGN UP FORM ############ *//


//* ############ SIGN IN FORM ############ *//
var signInForm = document.getElementById("signin-form");
var in_emailInput = document.getElementById("in_email-input");
var in_passwordInput = document.getElementById("in_password-input");

$("#signin_submit").on("click",function(){
    console.log("get started",in_emailInput.val);
    signin();
})

function signin(){
    console.log("get started",in_emailInput.val);
    firebase.auth().signInWithEmailAndPassword(in_emailInput.value, in_passwordInput.value)
        .then(function() {
            window.location = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
}
//* ############ END OF SIGN IN FORM ############ *//

//* ############ START OF PRODUCT INTRO ############ *//
$("#role").click(function(){
    $("#support_img_src").prop("src","src/img/Landing Page Image 1.png");
    $("#support_img div").css("top","30px");
    $("#support_img div").css("left","40px");
})
$("#problem").click(function(){
    $("#support_img_src").prop("src","src/img/Landing Page Image 2 (1).png");
    $("#support_img div").css("top","200px");
    $("#support_img div").css("left","40px");
})
$("#solution").click(function(){
    $("#support_img_src").prop("src","src/img/Landing Page Image 3.png");
    $("#support_img div").css("top","200px");
    $("#support_img div").css("left","200px");
})

$(".sub_info").click(function(){
    $(".sub_info").css("background","white");
    $(".sub_info").css("color","black");
    $(this).css("background","linear-gradient(to right, navy, lightblue)");
    $(this).css("color","white");
    $(this).css("box-shadow", "0 0 20px 10px white");
})



