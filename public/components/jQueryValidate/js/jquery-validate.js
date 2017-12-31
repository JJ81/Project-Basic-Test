(function($) {
    'use strict';

    // get language from the body html
    var language;
    if ( $('*[data-lang]' ).length >= 1 ) { 
        language = $('body').attr('data-lang');
    }else{
        language = 'en';
    }

    // Regex validation rules
    var validate = {
        required: /./,
        name: /^[A-Za-z ,'-]{1,25}$/,
        email: /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/,
        zipcode: /^\d{5}(?:[-\s]\d{4})?$/,
        postalcode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        telephone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
        password: /^[a-z0-9_-]{6,18}$/,
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        date: /^([1-9]|0[1-9]|[12][0-9]|3[01])\D([1-9]|0[1-9]|1[012])\D(19[0-9][0-9]|20[0-9][0-9])$/, // dd mm yyyy, d/m/yyyy, etc.
        year: /^(19|20)[\d]{2,2}$/,
        number: /^[0-9]{1,45}$/,
        alphabet: /^[A-z]+$/,
        alphanumeric: /^[a-zA-Z0-9]*$/,
        ipaddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        hexvalue: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
    };

    // Error messages after validation rules
    var errorMessage = {
        en:{
            required: 'This field is required',
            name: 'A valid name is required',
            email: 'A valid email address is required',
            zipcode: 'A valid zip code is required',
            postalcode: 'A valid postal code is required',
            telephone: 'A valid phone number is required',
            password: 'A valid password is required',
            url: 'A valid URL is required',
            date: 'A valid date is required',
            year: 'A valid year is required',
            number: 'Numbers only',
            alphabet: 'Alphabet characters only',
            alphanumeric: 'Alphanumeric characters only',
            ipaddress: 'A valid IP address is required',
            hexvalue: 'A valid HEX value is required'
        },
        de:{
            required: 'Dieses Feld ist obligatorisch.',
            name: 'Eine gültige E-Mail-Adresse ist erforderlich',
            email: 'Ein gültiger Name ist erforderlich',
            zipcode: 'Eine gültige Postleitzahl ist erforderlich',
            postalcode: 'Eine gültige Postleitzahl ist erforderlich',
            telephone: 'Eine gültige Telefonnummer ist erforderlich',
            password: 'Ein gültiges Passwort ist erforderlich',
            url: 'Eine gültige URL ist erforderlich',
            date: 'Ein gültiges Datum ist erforderlich',
            year: 'Ein gültiges Jahr ist erforderlich',
            number: 'Nur Zahlen',
            alphabet: 'Nur Buchstaben',
            alphanumeric: 'Nur alphanumerische Zeichen',
            ipaddress: 'Eine gültige IP Adresse ist erforderlich',
            hexvalue: 'Ein gültiger HEX Wert ist erforderlich'
        },
        es:{
            required: 'Este campo es obligatorio',
            name: 'Se requiere una dirección de correo electrónico válida',
            email: 'Se requiere un nombre válido',
            zipcode: 'Se requiere un código postal válido',
            postalcode: 'Se requiere un código postal válido',
            telephone: 'Se requiere un número de teléfono válido',
            password: 'Se requiere una contraseña válida',
            url: 'Se requiere una URL válida',
            date: 'Se requiere una fecha válida',
            year: 'Se requiere un año válido',
            number: 'Solo números',
            alphabet: 'Solo caracteres alfabéticos',
            alphanumeric: 'Solo caracteres alfanuméricos',
            ipaddress: 'Se requiere una dirección IP válida',
            hexvalue: 'Se requiere un valor hexadecimal válido'
        }
    };

    var valid = new Array();
    var validationRules;

    // find all form elements on page
    $('input, select, textarea').each(function () {
        var attr = $(this).attr('data-validate');
        var fieldId = $(this).attr('id');

        if (typeof attr !== 'undefined' && attr !== false) {

            validationRules = $(this).data('validate').split(',');

            // wrap inputs and label in div field item
            $(this).prev('label').andSelf().wrapAll('<div class="field-item"/>');

            // check data attribute for validation rules
            for (var i = 0; i < validationRules.length; i++){
                // add error messages to markup
                var type = validationRules[i];
                type = type.replace(' ', '');

                var ariaError = fieldId + '-'+ type +'-error';

                //add ARIA role required if input is required
                if(type === 'required'){
                    $('#' + fieldId).attr('aria-required', 'true');
                }
                
                //add aria described by
                $('#' + fieldId).attr('aria-describedby', ariaError);

                var errormessage = errorMessage[language][type];

                // convert UTF8 string
                errormessage = errormessage.replace(
                    /[\uff01-\uff5e]/g,
                    function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); }
                    );

                // add error message to field
                $('#' + fieldId).parent('.field-item').append('<span class="error-message ' + type +'" id="'+ ariaError +'" role="alert">'+ errormessage +'</span>');
            }
            
        }
    });

    // Validate form fields function
    function validation(value, id){

        // hide any errors already showing
        $('#' + id).parent('.field-item').find('.error-message').hide();
        // remove existing border error class
        $('#' + id).removeClass('error-border');

        //trim blank space from value
        value = $.trim(value);

        // get validation rules from data attribute
        var attr = $('#' + id).attr('data-validate');
        if (typeof attr !== 'undefined' && attr !== false) {
            validationRules = $('#' + id).data('validate').split(',');

            // check data attribute for validation rules
            for (var i = 0; i < validationRules.length; i++){
                var type = validationRules[i];
                type = type.replace(' ', '');
                if(value === '' && type === 'required'){
                    // show required erorr
                    $('#' + id).parent('.field-item').find('.error-message.required').fadeIn();
                    $('#' + id).addClass('error-border');
                    valid.push('false');
                }else if(!validate[type].test($('#' + id).val()) && value != ''){
                    // fade in error message
                    $('#' + id).parent('.field-item').find('.error-message.' + type).fadeIn();
                    // add border class to the input field
                    $('#' + id).addClass('error-border');
                    valid.push('false');
                }else{
                    valid.push('true');
                }
            }
            
        }
    }

    // on blur validate fields
    $('input, select, textarea').on('blur', function(){

        // field value
        var value = $(this).val();
        var fieldId = $(this).attr('id');

        // pass value and field id to validation function
        validation(value, fieldId);

    });

    $('form').submit(function( event ) {
        //clear valid array
        valid = new Array();

        // prevent default form submit
        event.preventDefault();

        $('input, select, textarea').each(function () {
            var attr = $(this).attr('data-validate');
            var fieldId = $(this).attr('id');
            var value = $(this).val();

            if (typeof attr !== 'undefined' && attr !== false) {
                // pass field values and field ids to validation function
                validation(value, fieldId);
            }
        });
        if ($.inArray('false', valid) !== -1){
            // prevent default form submit
            event.preventDefault();
        }else{
            // Call submit form function
            submitForm();
        }
    });
    
}(jQuery));