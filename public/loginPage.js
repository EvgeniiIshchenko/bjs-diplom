"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
  let message = "Неверный логин или пароль.";
  ApiConnector.login(data, (response) => {
    if (response.success === true) {
      location.reload();
    } else {
      userForm.setLoginErrorMessage(message);
    }
  });
};

userForm.registerFormCallback = (data) => {
  let message = "Заполните обязательные поля.";

  ApiConnector.register(data, (response) => {
    console.log(response);
    if (response.success === true) {
      location.reload();
    } else {
      userForm.setLoginErrorMessage(message);
    }
  });
};
