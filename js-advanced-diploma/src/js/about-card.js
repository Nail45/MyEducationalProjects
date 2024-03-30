/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
import { el, mount, setChildren } from 'redom';
import moment from 'moment';
import '../styles/about-card.scss';
import { accounting } from 'accounting';
import autoComplete from '@tarekraafat/autocomplete.js';
import { makeTransferFunds, getId, getAccountByID } from './main.js';
import { createGraph } from './chart.js';
import { main } from './list-card.js';
import dragula from 'dragula';
import { btnSwitchDrag } from './currency.js';
const creditCardType = require('credit-card-type');
const valid = require('card-validator');

export const aboutCard = el('section', { class: 'about-card' });

const transferLogin = el('input', {
  class: 'form-control form-transfer__field',
  placeholder: 'Введите номер счёта получателя',
  type: 'text',
  id: 'autoComplete',
  dir: 'ltr',
  spellcheck: false,
  autocorrect: 'off',
  autocomplete: 'off',
  autocapitalize: 'off',
});

const transferSum = el('input', {
  class: 'form-control form-transfer__field',
  placeholder: 'Введите сумму перевода',
  type: 'number',
});

const ElErrorMessage = el('span', { class: 'error-message' });

function addPaymentSystemLogo(value, el) {
  switch (value) {
    case 'Mir':
      el.classList.add('Mir');
      break;
    case 'Mastercard':
      el.classList.add('Mastercard');
      break;
    case 'Visa':
      el.classList.add('Visa');
      break;
    case 'UnionPay':
      el.classList.add('UnionPay');
      break;
    case 'JCB':
      el.classList.add('JCB');
      break;
  }
}

function getTransferHistoryTable(data) {
  const tBody = el('tbody');
  tBody.innerHTML = '';
  for (
    let i = data.payload.transactions.length - 1;
    i > data.payload.transactions.length - 10;
    i--
  ) {
    const item = data.payload.transactions[i];
    if (item) {
      const amountEl = el(
        'td',
        `${accounting.formatMoney(
          item.amount,
          '\u20bd',
          2,
          ' ',
          ',',
          '%v %s',
        )}`,
        { class: 'transfer-table__td' },
      );
      if (data.payload.account === item.from) {
        amountEl.classList.add('amount-minus');
      } else {
        amountEl.classList.add('amount-plus');
      }

      const numberValidationFrom = valid.number(`${item.from}`);
      const numberValidationTo = valid.number(`${item.to}`);

      const tdFrom = el('td', `${item.from}`, {
        class: 'transfer-table__td from',
      });

      const tdTo = el('td', `${item.to}`, { class: 'transfer-table__td to' });

      const itemTr = el('tr', { class: 'transfer-table__tr-body' }, [
        tdFrom,
        tdTo,
        amountEl,
        el('td', `${moment(item.date).format('L')} `, {
          class: 'transfer-table__td',
        }),
      ]);
      if (
        numberValidationFrom.isPotentiallyValid &&
        numberValidationFrom.isValid
      ) {
        addPaymentSystemLogo(
          creditCardType(`${item.from} `)[0]?.niceType,
          tdFrom,
        );
      }
      if (numberValidationTo.isPotentiallyValid && numberValidationTo.isValid) {
        addPaymentSystemLogo(creditCardType(`${item.to} `)[0]?.niceType, tdTo);
      }
      mount(tBody, itemTr);
    }
  }

  const transferHistoryTable = el('table', { class: 'transfer-table' }, [
    el('thead', [
      el('tr', { class: 'transfer-table__tr-head' }, [
        el('th', 'Счёт отправителя', {
          scope: 'col',
          class: 'transfer-table__th',
        }),
        el('th', 'Счёт получателя', {
          scope: 'col',
          class: 'transfer-table__th',
        }),
        el('th', 'Сумма', { scope: 'col', class: 'transfer-table__th' }),
        el('th', 'Дата', { scope: 'col', class: 'transfer-table__th' }),
      ]),
    ]),
    tBody,
  ]);

  return transferHistoryTable;
}
const lookAccount = el('div', { class: 'look-account' });
const backAccount = el('div', { class: 'back-account' });
const newTransfer = el('div', { class: 'new-transfer' });
const dynamicLink = el('a', {
  class: 'dynamic dynamic-link',
  href: `/accounts/about-card/balance?id=${getId()}`,
});
const transferHistory = el('a', {
  class: 'transfer-history',
  href: `/accounts/about-card/balance?id=${getId()}`,
});

export function renderCard(data) {
  aboutCard.innerHTML = '';

  setChildren(lookAccount, [
    el(
      'div',
      'Просмотр счёта',
      {
        class: 'look-account__title',
      },
      [btnSwitchDrag],
    ),

    el('div', `№ ${data.payload.account} `, {
      class: 'look-account__number',
    }),
  ]);

  setChildren(backAccount, [
    el('a', 'Вернуться назад', {
      class: 'btn btn-primary back-account__link',
      href: '/accounts',
    }),
    el('div', { class: 'balance-wrap' }, [
      el('div', 'Баланс', { class: 'balance-title' }),
      el(
        'div',
        accounting.formatMoney(
          data.payload.balance,
          '\u20bd',
          2,
          ' ',
          ',',
          '%v %s',
        ),
        {
          class: 'balance-value',
        },
      ),
    ]),
  ]);

  const dataAccount = el('div', { class: 'data-account' }, [
    lookAccount,
    backAccount,
  ]);

  const labelIconTransfer = el(
    'label',
    { class: 'form-transfer__label', for: 'my-autocomplete' },
    [
      el('span', 'Номер счёта получателя', { class: 'form-transfer__text' }),
      transferLogin,
    ],
  );

  transferLogin.addEventListener('input', getPaymentSystem);
  transferLogin.addEventListener('blur', getPaymentSystem);
  transferLogin.addEventListener('paste', getPaymentSystem);

  function getPaymentSystem() {
    function removeClassIconToEl() {
      labelIconTransfer.classList.remove(
        'Mir',
        'Mastercard',
        'Visa',
        'UnionPay',
        'JCB',
      );
    }

    removeClassIconToEl();

    const numberValidation = valid.number(`${transferLogin.value} `);
    if (
      numberValidation.isPotentiallyValid &&
      numberValidation.isValid &&
      transferLogin.value.length > 3
    ) {
      addPaymentSystemLogo(
        creditCardType(`${transferLogin.value} `)[0]?.niceType,
        labelIconTransfer,
      );
    }

    if (transferLogin.value === '') removeClassIconToEl();
  }

  const formTransfer = el('form', { class: 'form-transfer' }, [
    el('div', { class: 'form-transfer__wrap' }, [
      ElErrorMessage,
      labelIconTransfer,
      el('label', { class: 'form-transfer__label' }, [
        el('span', 'Сумма перевода', { class: 'form-transfer__text' }),
        transferSum,
      ]),
    ]),
    el('button', 'Отправить', {
      class: 'btn btn-primary form-transfer__btn',
      type: 'submit',
    }),
  ]);

  const canvas = el('canvas', { id: 'canvas' });
  const canvasWrapBalance = el('div', [canvas]);

  mount(main, canvasWrapBalance);

  createGraph(canvas, data, 6, false);

  setChildren(newTransfer, [
    el('div', 'Новый перевод', { class: 'new-transfer__title' }),
    formTransfer,
  ]);

  setChildren(dynamicLink, [
    el('div', 'Динамика баланса', { class: 'dynamic-title' }),
    canvasWrapBalance,
  ]);

  setChildren(
    transferHistory,
    el('div', 'История переводов', { class: 'transfer-history__title' }),
    getTransferHistoryTable(data),
  );

  const transfer = el('div', { class: 'transfer' }, [newTransfer, dynamicLink]);

  window.addEventListener('load', () => {
    const accountsItem = getLocalStorageObj();
    console.log('start');

    const styleAutoComplete = el('link', {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/css/autoComplete.min.css',
    });

    mount(document.head, styleAutoComplete);
    const autoCompleteJS = new autoComplete({
      selector: '#autoComplete',
      data: {
        src: accountsItem,
        cache: true,
      },
      resultItem: {
        highlight: true,
      },
      events: {
        input: {
          selection: (event) => {
            const selection = event.detail.selection.value;
            autoCompleteJS.input.value = selection;
          },
        },
      },
    });
  });

  formTransfer.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromAccount = getId();
    if (transferLogin.value.trim() !== '' && transferSum.value.trim() !== '') {
      makeTransferFunds(fromAccount, transferLogin.value, transferSum.value);
      getAccountByID(fromAccount);
      barCanvasBalance.destroy();
    } else false;
  });

  const transferWrap = el('div', { class: 'transfer-wrap' });

  setChildren(transferWrap, [transfer, transferHistory]);
  setChildren(aboutCard, [dataAccount, transferWrap]);

  dragula([transferWrap], {
    moves: () => {
      if (aboutCard.classList.contains('drag-on')) {
        return true;
      } else {
        return false;
      }
    },
  });
}

export function checkTransfer(data) {
  const errorMessage = {
    'Invalid account from': 'Укажите верный счет списания',
    'Invalid account to': 'Укажите верный счет зачисления',
    'Invalid amount': 'Укажите положительную сумму перевода',
    'Overdraft prevented': 'Недостаточно средств',
    'Invalid route': 'Возникла не предвиденная ошибка попробуйте позже',
  };
  function showError(text) {
    ElErrorMessage.style.display = 'block';
    ElErrorMessage.textContent = text;
  }
  if (data.error) showError(errorMessage[data.error]);
  else {
    ElErrorMessage.style.display = 'none';
    const accountsItem = getLocalStorageObj();
    if (!accountsItem.includes(transferLogin.value.trim())) {
      accountsItem.push(transferLogin.value);
      localStorage.setItem('accounts', JSON.stringify(accountsItem));
    }
    transferLogin.value = '';
    transferSum.value = '';
  }
}

function getLocalStorageObj() {
  let localData = localStorage.getItem('accounts');
  if (localData !== '' && localData !== null) {
    let accountsItem = JSON.parse(localData);
    return accountsItem;
  } else {
    return [];
  }
}

btnSwitchDrag.addEventListener('click', () => {
  aboutCard.classList.toggle('drag-on');
});
