// Đối tượng `Validator`
function Validator(options) {       // ở HTML, Validator truyền vào là 1 object , được đặt tên ở đây là options

    //save rules vao trong object này 
    var selectorRules = {

    };


    // 2. tạo hàm riêng thuc hien việc validate
    function validate(inputElement, rule) {
            var errorMessage = rule.test(inputElement.value); 
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);    //errorSelector là #form-message bên HTML
                if (errorMessage) {
                    errorElement.innerHTML = errorMessage;     
                    inputElement.parentElement.classList.add('invalid');                   
                }
                else {
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('invalid');                   
                }
    };



    // 1. lay element cua form 
    var formElement = document.querySelector(options.form)         // lấy ra #form-1 và gán nó vào formElement
    if (formElement) {            //if có formElement
        
        // Đọc các hàm định nghĩa rules ở dưới . Khi return 2 object thì options.rules cũng sẻ nhận là các object và console.log ra mảng, 
        // vì vậy để lọc qua từng phần tử trong mảng thì dùng forEach 
        options.rules.forEach(function(rule) {

            // lưu lại các rules cho mỗi input
            selectorRules[rule.selector] = rule.test;

            // console.log(selector) ra để biet nó chứa giá trị gì
            var inputElement = formElement.querySelector(rule.selector);   // tìm các input trong formElement chứ ko phải trong document

            if (inputElement) {     // if inputElement tồn tại
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);    // gọi hàm validate
                }

                // Xử lý mỗi khi ng dùng nhập input
                inputElement.oninput = function () {
                    //tại vị trí input , ta get ra cha cua no - parentElement , từ cha trỏ vô .form-message
                    var errorElement = inputElement.parentElement.querySelector('.form-message');     

                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('invalid'); 
                }
            }
        });
    }
}



// Define rules
//Nguyen tac cua cac rules:
// 1. Khi có lỗi => trả ra mess lỗi
// 2. Khi hợp lệ => Ko trả ra gì cả (undefined)


// ---- dành cho form full-name
Validator.isRequired = function(selector, message) {     // selector = #full-name , đại diện cho tham số của Validator.isRequired
    return {
        selector : selector,    // selector = #full-name
        // funtion test kiem tra người dùng nhập     
        test : function(value) {    // value : giá trị nhap vào
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

// --- dành cho form email
Validator.isEmail = function(selector, message) {
    return {
        selector : selector,     // selector = #email
        test : function(value) { 
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập đúng Email ' 
        }
    }
}

// --- dành cho form password - kiem tra độ dài password
Validator.minLength = function(selector, min, message) {
    return {
        selector : selector,
        test : function(value) { 
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector : selector,
        test : function(value) { 
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}