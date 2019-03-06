const default_card_number = "●●●● ●●●● ●●●● ●●●●";
const default_expiration_date = "●●/●●";
const default_security_code = "●●●";
const default_name = "TabaPay Customer";
const default_signature = "";
const default_img = "https://www.tabapay.com/CI/TabaPay.png";
const visa_img = "https://www.tabapay.com/CI/V.png";
const mc_img = "https://www.tabapay.com/CI/M.png";
const ax_img = "https://www.tabapay.com/CI/A.png";
const dc_img = "https://www.tabapay.com/CI/D.png";
var number_valid, exp_date_valid, sec_code_valid, name_valid = false;

// Cached elements
var clear_button = document.getElementById('b1');
var submit_button = document.getElementById('b2');
var form = document.getElementById('input-form');

var inputs = document.querySelectorAll('[type="text"');
var card_number_input = document.getElementById('i1');
var expiration_date_input = document.getElementById('i2');
var security_code_input = document.getElementById('i3');
var name_input = document.getElementById('i4');

var card_number_display = document.getElementById('card-number');
var expiration_date_display = document.getElementById('exp-date');
var card_name_display = document.getElementById('cardholder-name');
var signature_display = document.getElementById('signature-box');
var sec_code_display = document.getElementById('security-code');

var card_number_label = document.getElementById("l1");
var card_number_msg = document.getElementById("m1");
var exp_date_label = document.getElementById("l2");
var exp_date_msg = document.getElementById("m2");
var sec_code_label = document.getElementById("l3");
var sec_code_msg = document.getElementById("m3");

var top_logo = document.getElementById('top-logo');
var top_logo_caption = document.getElementById('top-logo-caption');
var bottom_logo_front = document.getElementById('bottom-logo-front');
var wf_logo = document.getElementById('WF-logo');
var ba_logo = document.getElementById('BA-logo');

var card = document.querySelector('.card');

card_number_input.focus();

for(var i=0; i < inputs.length; i++){
	inputs[i].addEventListener('input',() => {
		let values = [];
	    inputs.forEach(v => {if(v.value){values.push(v.value)}});
		clear_button.disabled = (values.length==0);
	});
	inputs[i].addEventListener('click',() => {
		if(card.classList.contains('is-flipped') && event.target.name != "sec-code"){
			flipCard();
		}
	});
}
form.addEventListener('keyup', function(event) {
	event.preventDefault();
	if(number_valid && exp_date_valid && sec_code_valid && name_valid) submit_button.disabled = false;
});
form.addEventListener('input', function(event) {
	let target = event.target;
	let target_id = target.id;
	let target_value = target.value;
	event.preventDefault();
	switch(target_id) {
		case "i1":
			if(target_value){
				card_number_input.value = target_value.replace(/ /g, '').replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
				card_number_display.innerHTML = target_value.replace(/(\w{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
				checkSource(target_value);
				if(validateCardNumber(target_value)){
					number_valid = true;
					card_number_input.classList.remove('error');
					card_number_label.classList.remove('error');
					card_number_msg.classList.add('dn');
				} else {
					number_valid = false;
					card_number_input.classList.add('error');
				}
			} else {
				number_valid = false;
				card_number_input.classList.remove('error');
				card_number_label.classList.remove('error');
				card_number_msg.classList.add('dn');
				resetCardNumber();
			};
			break;
		case "i2":
			if(target_value){
				expiration_date_display.innerHTML = target_value;
				if(validateExpDate(target_value)){
					exp_date_valid = true;
					expiration_date_input.classList.remove('error');
				} else {
					exp_date_valid = false;
					expiration_date_input.classList.add('error');
				}
			} else {
				exp_date_valid = false;
				expiration_date_input.classList.remove('error');
				exp_date_label.classList.remove('error');
				exp_date_msg.classList.add('dn');
				expiration_date_display.innerHTML = default_expiration_date;
			};
			break;
		case "i3":
			if(target_value){
				sec_code_display.innerHTML = target_value;
				if(!isNaN(target_value) && /^\d+$/.test(target_value) && (target_value.length == 3 || target_value.length == 4)){
					sec_code_valid = true;
					security_code_input.classList.remove('error');
					sec_code_label.classList.remove('error');
					sec_code_msg.classList.add('dn');
				} else {
					sec_code_valid = false;
					security_code_input.classList.add('error');
				}
			} else {
				sec_code_valid = false;
				security_code_input.classList.remove('error');
				sec_code_label.classList.remove('error');
				sec_code_msg.classList.add('dn');
				sec_code_display.innerHTML = default_security_code;
			};
			break;
		case "i4":
			if(target_value){
				card_name_display.innerHTML = target_value;
				signature_display.innerHTML = target_value;
				name_valid = true;
			} else {
				name_valid = false;
				card_name_display.innerHTML = default_name;
				signature_display.innerHTML = default_signature;
			};
			break;
	}
})
form.addEventListener('focusout', function(event) {
	let target = event.target;
	let target_id = target.id;
	event.preventDefault();
	switch(target_id){
		case "i1":
			if(card_number_input.classList.contains('error')){
				card_number_label.classList.add('error');
				card_number_msg.classList.remove('dn');
			};
			break;
		case "i2":
			if(expiration_date_input.classList.contains('error')){
				exp_date_label.classList.add('error');
				exp_date_msg.classList.remove('dn');
			};
			break;
		case "i3":
			if(security_code_input.classList.contains('error')){
				sec_code_label.classList.add('error');
				sec_code_msg.classList.remove('dn');
			};
			break;
	}
})
function flipCard(){
	card.classList.toggle('is-flipped');
}
function showCardData(){
	var span = document.getElementsByClassName("close")[0];
	var modal = document.getElementById('alert-modal');
	var modal_paragraph = document.getElementById('modal-text');
	modal_paragraph.textContent = "You entered the following information... \r\nCredit Card Number: " +
	card_number_input.value + "\r\nExpiration Date: " + expiration_date_input.value + "\r\nSecurity Code: " + security_code_input.value + "\r\nName: " + name_input.value;
	modal.style.display = "block";
	span.onclick = function() {
		modal.style.display = "none";
	}
}
function clearForm(){
	var form = document.getElementById('input-form');
	var error_elems = document.querySelectorAll(".error");
	var msg_elems = document.querySelectorAll(".msg");

	form.reset();
	resetCardNumber();
	card_number_display.innerHTML = default_card_number;
	expiration_date_display.innerHTML = default_expiration_date;
	sec_code_display.innerHTML = default_security_code;
	card_name_display.innerHTML = default_name;
	signature_display.innerHTML = default_signature;
	clear_button.disabled = true;
	submit_button.disabled = true;

	[].forEach.call(error_elems, function(el) {
	    el.classList.remove("error");
	});
	[].forEach.call(msg_elems, function(el) {
	    el.classList.add("dn");
	});
	card_number_input.focus();
}
function checkSource(number){
	// https://www.bincodes.com/bin-list/
	var first_two = number.substring(0,2);
	var first_four = Number(number.substring(0,4));
	var first_six = Number(number.substring(0,6));
	//TODO: use switch statement
	if(number.charAt(0) == '4'){
		bottom_logo_front.src = visa_img;
		bottom_logo_front.style.height = "30px";
		if(number.startsWith('400390')){
			ba_logo.classList.remove('dn');
			top_logo.classList.add('dn');
			top_logo_caption.classList.add('dn');
		} else if(number.startsWith('407110')){
			wf_logo.classList.remove('dn');
			top_logo.classList.add('dn');
			top_logo_caption.classList.add('dn');
		}else {
			ba_logo.classList.add('dn');
			wf_logo.classList.add('dn');
			top_logo.classList.remove('dn');
			top_logo_caption.classList.remove('dn');
		}
	} else if(number.startsWith('34') || number.startsWith('37')){
		bottom_logo_front.src = ax_img;
	} else if((first_four >= 2221 && first_four <= 2720) || (first_two >= 51 && first_two <= 55)){
		bottom_logo_front.src = mc_img;
	} else if(first_four == 6011 || (first_six >= 622126 && first_six <= 622925) || (first_six >= 624000 && first_six <= 626999) || (first_six >= 626200 && first_six <= 628899) || first_two == '64' || first_two == '65'){
		bottom_logo_front.src = dc_img;
	} else{
		bottom_logo_front.src = default_img;
	}
}
function resetCardNumber(){
	card_number_display.innerHTML = default_card_number;
	bottom_logo_front.src = default_img;
	bottom_logo_front.style.height = "50px";
}
function validateCardNumber(number){
	if (number.length < 13 || number.length > 19 || /[^0-9-\s]+/.test(number)) return false;
	// The Luhn Algorithm
	var nCheck = 0, nDigit = 0, bEven = false;
	number = number.replace(/\D/g, "");
	for (var n = number.length - 1; n >= 0; n--) {
		var cDigit = number.charAt(n),
			  nDigit = parseInt(cDigit, 10);
		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}
		nCheck += nDigit;
		bEven = !bEven;
	}
	return (nCheck % 10) == 0;
}
function validateExpDate(date_string){
	if(date_string.length == 5 && /^\d+$/.test(date_string.substring(0,2)) && Number(date_string.substring(0,2))<=12 && date_string.charAt(2) == '/' && Number(date_string.substring(3,4))){
		return true
	} else {
		return false
	}
}