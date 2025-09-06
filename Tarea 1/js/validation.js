function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDateToInput(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
    + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

var validateCantidad = function(cantidad) {
  if (!cantidad) return false;
  var numero = Number(cantidad);
  return !isNaN(numero) && numero >= 1;
};

var validateEdad = function(edad) {
  if (!edad) return false;
  var num_ed = Number(edad);
  return !isNaN(num_ed) && num_ed >= 1;
};

var validateName = function(name) {
  if(!name) return false;
  var lengthMaxValid = name.trim().length >= 3;
  var lengthMinValid = name.trim().length <= 200;
  return lengthMinValid && lengthMaxValid;
};

var validateEmail = function(email) {
  if (!email) return false;
  var lengthValid = email.length <= 100;
  var re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  var formatValid = re.test(email);
  return lengthValid && formatValid;
};

var validatePhoneNumber = function(phoneNumber) {
  if (!phoneNumber || phoneNumber.trim() === '') return true;
  var lengthValid = phoneNumber.length >= 13;
  var re = /^\+[0-9]{2,3}\.[0-9]{8}$/;
  return re.test(phoneNumber);
};

var validateFiles = function(files) {
  if (!files) return false;
  var lengthValid = 1 <= files.length && files.length <= 5;
  var typeValid = true;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var fileFamily = file.type.split("/")[0];
    typeValid = typeValid && (fileFamily == "image" || file.type == "application/pdf");
  }
  return lengthValid && typeValid;
};

var validateSelect = function(select) {
  if(!select) return false;
  return true;
};

var validateContacts = function() {
  for (var i = 1; i <= 5; i++) {
    var sel = document.getElementById('select-course-' + i);
    var input = document.getElementById('Id_URL_' + i);
    if (!sel) continue;
    if (sel.value && sel.value !== "") {
      if (!input) return false;
      var v = input.value ? input.value.trim() : "";
      if (v.length < 4 || v.length > 50) return false;
    }
  }
  return true;
};

var minFechaEntregaInput = '';

function validateFechaEntrega(value) {
  if (!value) return false;

  var re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!re.test(value)) return false;

  var selected = new Date(value);
  var minDate = new Date(minFechaEntregaInput);

  if (isNaN(selected.getTime()) || isNaN(minDate.getTime())) return false;
  return selected.getTime() >= minDate.getTime();
}

document.addEventListener('DOMContentLoaded', function() {
  var fechaInput = document.getElementById('fecha-entrega');
  if (fechaInput) {
    var ahora = new Date();
    var tresHoras = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);
    minFechaEntregaInput = formatDateToInput(tresHoras);

    fechaInput.value = minFechaEntregaInput;
    fechaInput.min = minFechaEntregaInput;
    fechaInput.required = true;
  }
});

var validateForm = function() {
  var myForm = document.forms["myForm"];
  var cantidad = myForm["cantidad"].value;
  var edad = myForm["edad"].value;
  var email = myForm["email"].value;
  var phoneNumber = myForm["phone"].value;
  var name = myForm["nombre"].value;
  var files = myForm["files"].files;
  var region = myForm["select-region"].value;
  var comuna = myForm["select-comuna"].value;
  var fechaEntrega = myForm["fecha-entrega"] ? myForm["fecha-entrega"].value : '';

  var invalidInputs = [];
  var isValid = true;
  var setInvalidInput = function(inputName) {
    invalidInputs.push(inputName);
    isValid = false;
  };

  if (!validateName(name)) setInvalidInput("Nombre");
  if (!validateCantidad(cantidad)) setInvalidInput("Cantidad");
  if (!validateEdad(edad)) setInvalidInput("Edad");
  if (!validateEmail(email)) setInvalidInput("Email");
  if (!validatePhoneNumber(phoneNumber)) setInvalidInput("Número");
  if (!validateFiles(files)) setInvalidInput("Fotos");
  if (!validateSelect(region)) setInvalidInput("Region");
  if (!validateSelect(comuna)) setInvalidInput("Comuna");
  if (!validateContacts()) setInvalidInput("Contactos (Id/URL deben tener 4-50 caracteres si eliges una red)");
  if (!validateFechaEntrega(fechaEntrega)) {
    setInvalidInput("Fecha disponible para entrega (debe existir, formato año-mes-día hora:minuto y ser >= prellenado)");
  }

  var validationBox = document.getElementById("val-box");
  var validationMessageElem = document.getElementById("val-msg");
  var validationListElem = document.getElementById("val-list");

  if (!isValid) {
    validationListElem.textContent = "";
    for (var ii = 0; ii < invalidInputs.length; ii++) {
      var listElement = document.createElement("li");
      listElement.innerText = invalidInputs[ii];
      validationListElem.appendChild(listElement);
    }
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";
    validationBox.hidden = false;
  } else {
    myForm.style.display = "none";
    validationMessageElem.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
    validationListElem.textContent = "";
    validationBox.style.backgroundColor = "#fff9d6";
    validationBox.style.borderLeftColor = "#f0ad4e";
    validationBox.hidden = false;

    var yesButton = document.createElement("button");
    yesButton.innerText = "Sí, estoy seguro";
    yesButton.style.marginRight = "10px";
    yesButton.addEventListener("click", function() {
      validationMessageElem.innerText = "Hemos recibido la información de adopción, muchas gracias y suerte!";
      validationListElem.textContent = "";
      validationBox.style.backgroundColor = "#ddffdd";
      validationBox.style.borderLeftColor = "#4CAF50";

      var goHomeBtn = document.createElement("button");
      goHomeBtn.innerText = "Volver a la portada";
      goHomeBtn.addEventListener("click", function() {
        window.location.href = "index.html";
      });
      validationListElem.appendChild(goHomeBtn);
    });

    var noButton = document.createElement("button");
    noButton.innerText = "No, no estoy seguro, quiero volver al formulario";
    noButton.style.marginLeft = "10px";
    noButton.addEventListener("click", function() {
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(yesButton);
    validationListElem.appendChild(noButton);
    validationBox.hidden = false;
  }
};

var submitBtn = document.getElementById("submit-btn");
if (submitBtn) submitBtn.addEventListener("click", validateForm);
