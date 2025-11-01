const fetchFormElement = (name, selector) => {
  return {
    name: "",
    domElement: document.querySelector(selector),
    errorMessage: null,
  };
};

const checkInputValue = (input) => {
  if (input.domElement.value.trim() == "") {
    const parent = input.domElement.parentElement;
    input.domElement.classList.remove("error");
    input.domElement.classList.add("error");
    let errorMsg = parent.querySelector(".error-msg");

    if (!errorMsg) {
      errorMsg = document.createElement("span");
      errorMsg.classList.add("error-msg");
      parent.appendChild(errorMsg);
    }
    errorMsg.textContent = "Por favor, completa el campo";
    input.errorMessage = errorMsg;
    return false;
  } else {
    input.domElement.classList.remove("error");
    if (input.errorMessage) input.errorMessage.remove();
    return true;
  }
};


const loginUsernameField = fetchFormElement(
  "nombre de usuario",
  "#login_form_field_username"
);
const loginPasswordField = fetchFormElement(
  "contraseña",
  "#login_form_field_password"
);
const loginForm = fetchFormElement("formulario", "#login_form");
const registerForm = fetchFormElement("formulario", "#register_form");
const registerNameField = fetchFormElement("formulario", "#register_form_field_name");
const registerLastNameField = fetchFormElement("formulario", "#register_form_field_lastname");
const registerUsernameField = fetchFormElement("formulario", "#register_form_field_username");
const registerAgeField = fetchFormElement("formulario", "#register_form_field_age");
const registerPasswordField = fetchFormElement("formulario", "#register_form_field_password");
const registerRepeatPasswordField = fetchFormElement("formulario", "#register_form_field_password_repeat");
const registerEmailField = fetchFormElement("formulario", "#register_form_field_email");

loginForm.domElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameCheck = checkInputValue(loginUsernameField);
  const passwordCheck = checkInputValue(loginPasswordField);

  if(usernameCheck && passwordCheck){
  window.location.href = "index.html";
  }
});

loginUsernameField.domElement.addEventListener("input", () => {
  checkInputValue(loginUsernameField);
});
loginPasswordField.domElement.addEventListener("input", () => {
  checkInputValue(loginPasswordField);
});

registerForm.domElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameCheck = checkInputValue(registerNameField);
  const lastnameCheck = checkInputValue(registerLastNameField);
  const emailCheck = checkInputValue(registerEmailField);
  const usernameCheck = checkInputValue(registerUsernameField);
  const passwordCheck = checkInputValue(registerPasswordField);
  const repeatPasswordCheck = checkInputValue(registerRepeatPasswordField);

  if(nameCheck && lastnameCheck){
    window.location.href = "index.html";
  }
});