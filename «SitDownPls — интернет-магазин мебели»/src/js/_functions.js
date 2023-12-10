import { listItem, couchBtnSwitchOne, couchBtnSwitchTwo, couchBtnSwitchThree } from '../js/_vars.js';

function showPageCardsOne(status) {
  for (let i = 10; i <= listItem.length; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

function showPageCardsTwo(status) {
  for (let i = 1; i <= listItem.length - 9; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

function showPageCardsAllTablet(status) {
  for (let i = 1; i <= listItem.length; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

function showPageCardsOneTablet(status) {
  for (let i = 1; i <= listItem.length - 12; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

function showPageCardsTwoTablet(status) {
  for (let i = 7; i <= listItem.length - 6; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

function showPageCardsThreeTablet(status) {
  for (let i = 13; i <= listItem.length; i++) {
    document.querySelector(`[data-item="${i}"]`).style.display = status;
  }
}

export function changedCouchCatalog() {
  if (innerWidth > 768) {

    showPageCardsOne('none')

    couchBtnSwitchOne.addEventListener('click', () => {
      couchBtnSwitchOne.classList.add('active');
      couchBtnSwitchTwo.classList.remove('active');
      if (couchBtnSwitchOne.classList.contains('active')) {
        showPageCardsOne('none')
        showPageCardsTwo('block')
      }
    })

    couchBtnSwitchTwo.addEventListener('click', () => {
      couchBtnSwitchOne.classList.remove('active');
      couchBtnSwitchTwo.classList.add('active');
      if (couchBtnSwitchTwo.classList.contains('active')) {
        showPageCardsTwo('none')
        showPageCardsOne('block')
      }
    })

  } else {

    couchBtnSwitchOne.addEventListener('click', () => {
      couchBtnSwitchOne.classList.add('active');
      couchBtnSwitchTwo.classList.remove('active');
      couchBtnSwitchThree.classList.remove('active');
      if (couchBtnSwitchOne.classList.contains('active')) {
        showPageCardsAllTablet('none')
        showPageCardsOneTablet('flex')
      }
    })

    couchBtnSwitchTwo.addEventListener('click', () => {
      couchBtnSwitchTwo.classList.add('active');
      couchBtnSwitchOne.classList.remove('active');
      couchBtnSwitchThree.classList.remove('active');
      if (couchBtnSwitchTwo.classList.contains('active')) {
        showPageCardsAllTablet('none')
        showPageCardsTwoTablet('flex')
      }
    })

    couchBtnSwitchThree.addEventListener('click', () => {
      couchBtnSwitchThree.classList.add('active');
      couchBtnSwitchOne.classList.remove('active');
      couchBtnSwitchTwo.classList.remove('active');
      if (couchBtnSwitchThree.classList.contains('active')) {
        showPageCardsAllTablet('none')
        showPageCardsThreeTablet('flex')
      }
    })

    showPageCardsAllTablet('none')
    showPageCardsOneTablet('flex')
  }
}

