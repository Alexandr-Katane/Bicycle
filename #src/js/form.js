let forms = document.querySelectorAll('form');
if (forms.length > 0) {
    for (let index = 0; index < forms.length; index++) {
        const el = forms[index];
        el.addEventListener('submit', form_submit);
    }
}

function form_submit(e) {
    let btn = event.target;
    let form = btn.closest('form');
    let message = form.getAttribute('data-message');
    let er = form.querySelectorAll('.form__error');
    for (let i = 0; i < er.length; i++) {
        form.removeChild(er[i]);
    }
    let error = form_validate(form);

    if (error == 0) {
        //SendForm
        form_clean(form);
        if (message) {
            /*popup_open('message - ' + message);*/
            e.preventDefault();
        }
    } else {
        let form_error = form.querySelectorAll('._error');
        if (form_error && form.classList.contains('_goto-error')) {
            _goto(form_error[0], 1000, 50);
        }
        event.preventDefault();
    }
}

function form_validate(form) {
    let error = 0;
    let form_req = form.querySelectorAll('._req');
    if (form_req.length > 0) {
        for (let index = 0; index < form_req.length; index++) {
            const el = form_req[index];
            if (!_is_hidden(el)) {
                error += form_validate_input(el);
            }
        }
    }
    return error;
}

function _is_hidden(el) {
    el.hidden;
}

function form_validate_input(input) {
    let error = 0;
    let input_g_value = input.getAttribute('data-value');
    if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
        if (input.value != input_g_value) {
            let em = input.value.replace(" ", "");
            input.value = em;
        }
        if (!email_test(input.value) || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
        form_add_error(input);
        error++;
    } else {
        if (input.value == '' || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    }
    return error;
}

function email_test(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function form_add_error(input) {
    input.classList.add('_error');
    input.parentElement.classList.add('_error');

    let input_error = input.parentElement.querySelector('.form__error');
    if (input_error) {
    }
    let input_error_text = input.getAttribute('data-error');
    if (input_error_text && input_error_text != '') {
        input.insertAdjacentHTML('afterend', '<div class="form__error">' + input_error_text + '</div>');
    }

}

function form_remove_error(input) {
    input.classList.remove('_error');
    input.parentElement.classList.remove('_error');
    let input_error = input.parentElement.querySelector('.form__error');
    if (input.nextElementSibling == input_error) {
        input.nextElementSibling.remove(input_error);
    }
}

function form_clean(form) {
    for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_focus');
        el.classList.remove('_focus');
        el.value = el.getAttribute('data-value');
    }
    let checkboxes = form.querySelectorAll('.checkbox__input');
    if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
            const checkbox = checkboxes[index];
            checkbox.checked = false;
        }
    }
    let selects = form.querySelectorAll('select');
    if (selects.length > 0) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_default_valut = select.getAttribute('data-default');
            select.value = select_default_valut;
            select_item(select);
        }
    }
}



//===========================================================
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
    if (inputs.length > 0) {
        for (let index = 0; index < inputs.length; index++) {
            const input = inputs[index];
            const input_g_value = input.getAttribute('data-value');
            input_placeholder_add(input);
            if (input.value != '' && input.value != input_g_value) {
                input_focus_add(input);
            }
            input.addEventListener('focus', function (e) {
                if (input.value == input_g_value) {
                    input_focus_add(input);
                    input.value = '';
                }
                if (input.getAttribute('data-type') === "pass") {
                    input.setAttribute('type', 'password');
                }
                if (input.classList.contains('_date')) {
                    /*input.classList.add('_mask');
                    Inputmask("99.99.9999",{
                        "placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function(){
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);*/
                }
                if (input.classList.contains('_phone')) {
                    input.classList.add('_mask');
                    Inputmask("+380 (99) 9999999", {
                        //"placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function () {
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);
                }
                if (input.classList.contains('_digital')) {
                    input.classList.add('_mask');
                    Inputmask("9{1,}", {
                        "placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function () {
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);
                }
                form_remove_error(input);
            });
            input.addEventListener('blur', function (e) {
                if (input.value == '') {
                    input.value = input_g_value;
                    input_focus_remove(input);
                    if (input.classList.contains('_mask')) {
                        input_clear_mask(input, input_g_value);
                    }
                    if (input.getAttribute('data-type') === "pass") {
                        input.setAttribute('type', 'text');
                    }
                }
            });
            if (input.classList.contains('_date')) {
                datepicker(input, {
                    customDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                    formatter: (input, date, instance) => {
                        const value = date.toLocalDateString();
                        input.value = value;
                    },
                    onSelect: function (input, instance, date) {
                        input_focus_add(input.el);
                    }
                });
            }
        }
    }
}

function input_placeholder_add(input) {
    const input_g_value = input.getAttribute('data-value');
    if (input.value == '' && input_g_value != '') {
        input.value = input_g_value;
    }
}

function input_focus_add(input) {
    input.classList.add('_focus');
    input.parentElement.classList.add('_focus');
}

function input_focus_remove(input) {
    input.classList.remove('_focus');
    input.parentElement.classList.remove('_focus');
}

function input_clear_mask(input, input_g_value) {
    input.inputmask.remove();
    input.value = input_g_value;
    input_focus_remove(input);
}

