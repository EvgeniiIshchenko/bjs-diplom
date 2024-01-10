"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (response.success === true) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  if (response.success === true) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function getStockData() {
  ApiConnector.getStocks((response) => {
    if (response.success === true) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

getStockData();

setInterval(getStockData, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    let message = "Баланс пополнен";
    let isSuccess = data.amount && data.currency;
    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
    } else {
      message = "Невозможно пополнить баланс";
    }

    moneyManager.setMessage(isSuccess, message);
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    let message = `Невозможно конвертировать из ${data.fromCurrency} в ${data.targetCurrency}.`;
    let isSuccess = false;

    if (
      data.fromCurrency === "" ||
      data.targetCurrency === "" ||
      data.fromAmount === ""
    ) {
      message = "Заполните обязательные поля";
    }

    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
      isSuccess = true;
      message = "Конвертация валюты успешно выполнена";
    }

    moneyManager.setMessage(isSuccess, message);
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    let message = "Перевод средств успешно выполнен";
    let isSuccess = true;

    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
    } else {
      isSuccess = false;
      message = "Заполните обязательные поля";
    }

    moneyManager.setMessage(isSuccess, message);
  });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
  if (response.success === true) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    let isSuccess = true;
    let message = "Пользователь успешно добавлен в избранное";

    if (response.success === true) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      isSuccess = false;
      message = "Заполните обязательные поля";
    }

    favoritesWidget.setMessage(isSuccess, message);
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    let isSuccess = true;
    let message = "Пользователь успешно удалён из избранного";

    if (response.success === true) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      isSuccess = false;
      message = "Не удалось удалить пользователя";
    }

    favoritesWidget.setMessage(isSuccess, message);
  })
}
