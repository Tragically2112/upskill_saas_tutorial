/* global $, Stripe, stripeResponseHandler, response */

//Document ready function
$(document).on('turbolinks:load', function(){
  
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');

  //set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  //when user clicks form submit button
  submitBtn.click(function(event){
    //prevent the default submission behaviour
    event.preventDefault();
    submitBtn.val("Proccesing").prop('disabled', true);
    
    //collect the credit card fields
    var ccNum = $('#card_number').val(), 
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
  
    //Use Stripe JS library to che for card errors
    var error = false;
  
    //validate card number
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid');
    }
    
    //validate CVC number
    if (!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The cvc number appears to be invalid');
    }
    
    //validate card expiration date
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid');
    }
    
    if (error) {
      //If there are card errors, dont send to Stripe
      submitBtn.prop('disabled', false).val("Sign up");
    } else {
      //send the card info to Stripe
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    
    return false;
  });
  
  //Stripe will return back a card token
  function stripeResponseHandler(status, reponse) {
    
    //Get the token from the response
    var token = response.id;
    
      
    //inject card token in a hidden field
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );

    //submit form to rails app
    theForm.get(0).submit();
  
  }
});