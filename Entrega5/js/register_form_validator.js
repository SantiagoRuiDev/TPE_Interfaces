const fetchFormElement = (name, selector) => {
  return {
    name: "",
    domElement: document.querySelector(selector),
    errorMessage: null,
  };
};

const checkInputValue = (input) => {
  const parent = input.domElement.parentElement;
  let errorMsg = parent.querySelector(".error-msg");
  if (input.domElement.value.trim() == "") {
    input.domElement.classList.remove("error");
    input.domElement.classList.add("error");

    if (!errorMsg) {
      errorMsg = document.createElement("span");
      errorMsg.classList.add("error-msg");
      parent.appendChild(errorMsg);
    }
    errorMsg.textContent = "Por favor, completa el campo";
    input.errorMessage = errorMsg;
    return false;
  } else {
    if (input.domElement.type == "number") {
      if (input.domElement.value < 0 || input.domElement.value < 15) {
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.classList.add("error-msg");
          parent.appendChild(errorMsg);
        }
        input.domElement.classList.remove("error");
        input.domElement.classList.add("error");
        errorMsg.textContent = "La edad minima para registrarse es de 15 años.";
        input.errorMessage = errorMsg;
        return false;
      }
    }
    if (input.domElement.type == "password") {
      if (
        !comparePassword(
          registerPasswordField.domElement.value,
          registerRepeatPasswordField.domElement.value
        )
      ) {
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.classList.add("error-msg");
          parent.appendChild(errorMsg);
        }
        input.domElement.classList.remove("error");
        input.domElement.classList.add("error");
        errorMsg.textContent = "Las contraseñas deben coincidir.";
        input.errorMessage = errorMsg;
        return false;
      }
    }
    if (input.domElement.type == "email") {
      console.log(isValidEmail(input.domElement.value))
      if (!isValidEmail(input.domElement.value)) {
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.classList.add("error-msg");
          parent.appendChild(errorMsg);
        }
        input.domElement.classList.remove("error");
        input.domElement.classList.add("error");
        errorMsg.textContent = "El correo electronico debe ser valido.";
        input.errorMessage = errorMsg;
        return false;
      }
    }

    input.domElement.classList.remove("error");
    if (input.errorMessage) input.errorMessage.remove();
    return true;
  }
};

function isValidEmail(mail) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail);
}

const registerForm = fetchFormElement("formulario", "#register_form");
const registerNameField = fetchFormElement(
  "formulario",
  "#register_form_field_name"
);
const registerLastNameField = fetchFormElement(
  "formulario",
  "#register_form_field_lastname"
);
const registerUsernameField = fetchFormElement(
  "formulario",
  "#register_form_field_username"
);
const registerAgeField = fetchFormElement(
  "formulario",
  "#register_form_field_age"
);
const registerPasswordField = fetchFormElement(
  "formulario",
  "#register_form_field_password"
);
const registerRepeatPasswordField = fetchFormElement(
  "formulario",
  "#register_form_field_password_repeat"
);
const registerEmailField = fetchFormElement(
  "formulario",
  "#register_form_field_email"
);

registerForm.domElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameCheck = checkInputValue(registerNameField);
  const lastnameCheck = checkInputValue(registerLastNameField);
  const emailCheck = checkInputValue(registerEmailField);
  const ageCheck = checkInputValue(registerAgeField);
  const passwordCheck = checkInputValue(registerPasswordField);
  const repeatPasswordCheck = checkInputValue(registerRepeatPasswordField);

  if (nameCheck && lastnameCheck && emailCheck && ageCheck && passwordCheck && repeatPasswordCheck) {
    window.location.href = "index.html";
  }
});

function comparePassword(pass, repeat) {
  return pass == repeat;
}

registerNameField.domElement.addEventListener("input", () => {
  checkInputValue(registerNameField);
});
registerLastNameField.domElement.addEventListener("input", () => {
  checkInputValue(registerLastNameField);
});
registerAgeField.domElement.addEventListener("input", () => {
  checkInputValue(registerAgeField);
});
registerPasswordField.domElement.addEventListener("input", () => {
  checkInputValue(registerPasswordField);
  checkInputValue(registerRepeatPasswordField);
});
registerRepeatPasswordField.domElement.addEventListener("input", () => {
  checkInputValue(registerRepeatPasswordField);
  checkInputValue(registerPasswordField);
});
registerEmailField.domElement.addEventListener("input", () => {
  checkInputValue(registerEmailField);
});
