// Calculator Related
const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const completeScreen = document.querySelector('.calculator__screen');
const smallScreen = document.querySelector('.calculator__screen__one');
const mainScreen = document.querySelector('.calculator__screen__main');
const calculatorBody = document.querySelector('.calculator__body');

// Buttons Related
const allButtons = document.querySelectorAll('.btn');
const whiteButtons = document.querySelectorAll('.btn--white');
const orangeButtons = document.querySelectorAll('.btn--orange');
const cyanButtons = document.querySelectorAll('.btn--cyan');

// Theme Related 
const themeButton = document.querySelector('.calculator__theme');
const themeIconSun = document.querySelector('#theme__sun');
const themeIconMoon = document.querySelector('#theme__moon');

// Variables
let numberFirst;
let decimalFirst;
let result = 0;
const keyboardOperationsArray = ['+', '-', '*', '/'];
const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
let showingResult;
let lastOneOperation;

class MainFunctions {
  static changeTheme() {
    // Theme button related
    themeButton.classList.toggle('background-white');
    themeIconMoon.classList.toggle('display-none');
    themeIconSun.classList.toggle('display-block');
    
    // Theme Background-color and Font-color related
    calculator.classList.toggle('background-light-gray');
    calculatorBody.classList.toggle('background-white');
    completeScreen.classList.toggle('icon-dim-black');
    body.classList.toggle('background-body-light-theme');

    // Theme buttons related
    whiteButtons.forEach((item) => {
      item.classList.toggle('icon-dim-black');
    });
    cyanButtons.forEach((item) => {
      item.classList.toggle('color-dark-cyan');
    });
    allButtons.forEach((item) => {
      item.classList.toggle('background-light-gray');
    });
  }

  static initialStateOfCalculator() {
    smallScreen.textContent = '';
    mainScreen.textContent = 0;
    mainScreen.style.fontSize = '3rem';
    numberFirst = true;
    decimalFirst = true;
    result = 0;
  }

  static substringLastChar(string) {
    return string.substring(0, string.length-1);
  }

  static lengthChecker() {
    let currentScreenLength = mainScreen.textContent.length;
    let boolToBeReturned = true;

    mainScreen.style.fontSize = '3rem';

    if (currentScreenLength > 15) {
      mainScreen.style.fontSize = '2.5rem';
    }
    if (currentScreenLength > 18) {
      mainScreen.style.fontSize = '2rem';
    }
    if (currentScreenLength > 23) {
      boolToBeReturned = false;
    }

    // However,
    if (lastOneOperation) {
      boolToBeReturned = true;
    }

    return boolToBeReturned;
  }

  static handlingNumbers(number) {
    if (numberFirst) {
      if (number != 0) {
        mainScreen.textContent = number;
        numberFirst = false;
      }
    }

    else {
      mainScreen.textContent += number;
    }
    lastOneOperation = false;
    showingResult = false;
  }

  static backspace() {
    let currentString = mainScreen.textContent;
    let charToBeDeleted = currentString[currentString.length-1];

    if (charToBeDeleted == '.') {
      decimalFirst = true;
    }

    mainScreen.textContent = this.substringLastChar(currentString);
    if (mainScreen.textContent == '') {
      mainScreen.textContent = 0;
      numberFirst = true;
    }
  }

  static clear() {
    MainFunctions.initialStateOfCalculator();
  }

  static percentageHandler() {
    let lastString = mainScreen.textContent;
    if (result == 0) {
      mainScreen.textContent = lastString / 100;
    }
    
    else {
      let lastCharRemoved = this.substringLastChar(result);
      let showOnScreen = lastString * (lastCharRemoved / 100);
      mainScreen.textContent = showOnScreen;
      smallScreen.textContent = eval(result + showOnScreen);
    }
  }

  static decimalHandler() {
    if (decimalFirst) {
      if (numberFirst) {
        mainScreen.textContent = '.';
        numberFirst = false;
      }
      else {
        mainScreen.textContent += '.';
      }
      
      decimalFirst = false;
    }
  }

  static resultHandler() {
    if (result != 0 && !lastOneOperation && !showingResult) {
      let lastString = mainScreen.textContent;
      result += lastString;
      result = eval(result);
      mainScreen.textContent = result;
      smallScreen.textContent = '';
      this.lengthChecker();

      showingResult = true;
      numberFirst = true;
      decimalFirst = true;
      result = 0;
    }
  }

  static operationsHandler(operation) {
    let lastString = mainScreen.textContent;

    if (result != '0' && !lastOneOperation) {
      result += lastString + operation;
    }

    else if (result != 0) {
      // do nothing as in this case we need the input from the user
    }

    else {
      result = lastString + operation;
    }

    numberFirst = true;
    decimalFirst = true;
    lastOneOperation = true;

    let requiredStringForResult = this.substringLastChar(result);
    result = eval(requiredStringForResult) + operation;
    let resultToBeShown = result;

    if (operation == '/') {
      resultToBeShown = this.substringLastChar(resultToBeShown) + ' ÷';
    }

    else if (operation == '*') {
      resultToBeShown = this.substringLastChar(resultToBeShown) + ' x';
    }

    else {
      let temporaryRemoved = result[result.length-1];
      resultToBeShown = this.substringLastChar(resultToBeShown) + ' ' + temporaryRemoved;
    }

    smallScreen.textContent = resultToBeShown;
    mainScreen.textContent = this.substringLastChar(result);
  }
}

themeButton.onclick = () => {
  MainFunctions.changeTheme();
}

MainFunctions.initialStateOfCalculator();

function mainFunction(buttonValue, keyValue) {
  let canType = MainFunctions.lengthChecker();

  keyboardOperationsArray.forEach((operator) => {
    if (buttonValue == operator || keyValue == operator) {
      if (buttonValue == undefined) {
        buttonValue = keyValue;
      }
      MainFunctions.operationsHandler(buttonValue);
    }
  });

  if (buttonValue == 'd' || keyValue == 'backspace') {
    MainFunctions.backspace();
  }

  if (buttonValue == 'c' || keyValue == 'delete') {
    MainFunctions.clear();
  }

  if (buttonValue == '%' || keyValue == 'p') {
    MainFunctions.percentageHandler();
  }

  if (buttonValue == '=' || keyValue == 'enter') {
    MainFunctions.resultHandler();
  }

  if (canType) {
    if (buttonValue == Number(buttonValue) || keyValue in numberArray) {
      if (buttonValue == undefined) {
        buttonValue = keyValue;
      }
      MainFunctions.handlingNumbers(buttonValue);
    }

    else if (buttonValue == '.' || keyValue == '.') {
      MainFunctions.decimalHandler();
    }
  }
}

allButtons.forEach((button) => {
  button.onclick = () => mainFunction(button.value);
});

document.onkeydown = (event) => {
  event.target.blur();
  mainFunction(undefined, event.key.toLowerCase());
};