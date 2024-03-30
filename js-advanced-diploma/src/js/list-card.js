import { el, mount } from 'redom';
import '../styles/list-card.scss';
import { accounting } from 'accounting';
import moment from 'moment';
import Navigo from 'navigo';
import dragula from 'dragula';
import Choices from 'choices.js';

const DELAY_MS = 5000;

moment.locale('ru');

export const router = new Navigo('/');

export const ATMbtn = el('a', 'Банкоматы', {
  class: 'btn nav-btn',
  href: '/atm',
});

export const accountbtn = el('a', 'Счета', {
  class: 'btn nav-btn',
  href: '/accounts',
});

export const currencybtn = el('a', 'Валюта', {
  class: 'btn nav-btn',
  href: '/currencies',
});

export const exitbtn = el('a', 'Выйти', { class: 'btn nav-btn', href: '/' });

exitbtn.addEventListener('click', () => {
  localStorage.removeItem('auth');
});

export const listNav = el('nav', [
  el('ul', { class: 'nav-list' }, [
    el('li', [ATMbtn]),
    el('li', [accountbtn]),
    el('li', [currencybtn]),
    el('li', [exitbtn]),
  ]),
]);

const btnAddAccountError = el(
  'span',
  'Возникла не предвиденная ошибка попробуйте позже',
  { class: 'add-account__error' },
);

export const btnAddAccount = el(
  'button',
  `Создать новый счёт`,
  {
    class: 'btn btn-primary add-account',
  },
  [btnAddAccountError],
);

const accountsSelect = el('div', { class: 'accounts-select-wrap skeleton' }, [
  el('select', { class: 'accounts-select' }, [
    el('option', 'Сортировка', {
      class: 'accounts-option',
      value: 'sort',
      selected: true,
      disabled: true,
    }),
    el('option', 'По номеру', {
      class: 'accounts-option',
      value: 'number',
    }),
    el('option', 'По балансу', {
      class: 'accounts-option',
      value: 'balance',
    }),
    el('option', 'По последней транзакции', {
      class: 'accounts-option',
      value: 'transaction',
    }),
  ]),
]);

function getChoicesLoad() {
  const select = el('link', {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css',
  });

  mount(document.head, select);
  function getChoices() {
    const element = document.querySelector('.accounts-select');
    const choices = new Choices(element, {
      searchEnabled: false,
      sorter: () => {},
      itemSelectText: '',
    });
  }
  getChoices();
  accountsSelect.classList.remove('skeleton');
}

export const sortWrapEl = el('div', { class: 'sort-wrap' }, [
  el('h1', 'Ваши счета', { class: 'sort-title' }),
  accountsSelect,
]);

export const accounts = el('section', { class: 'accounts' }, [
  sortWrapEl,
  btnAddAccount,
]);

export const main = el('main', { class: 'main' });

function selectSortAccounts(arr, sign) {
  arr.sort((a, b) => {
    if (a[sign] < b[sign]) return -1;
  });
}

export const listAccounts = el('section', { class: 'list-accounts' });

dragula([listAccounts]);

export function getListCards(data) {
  let copyData = [...data.payload];
  renderAccounts(copyData);
  accountsSelect.addEventListener('change', (e) => {
    switch (e.target.value) {
      case 'number':
        selectSortAccounts(copyData, 'account');
        renderAccounts(copyData);
        break;
      case 'balance':
        selectSortAccounts(copyData, 'balance');
        renderAccounts(copyData);
        break;
      case 'transaction':
        copyData.sort((a, b) => {
          if (a.transactions[0]?.date < b.transactions[0]?.date) return -1;
        });
        renderAccounts(copyData);
        break;
    }
  });

  getChoicesLoad();

  function renderAccounts(copyData) {
    listAccounts.innerHTML = '';
    for (const item of copyData) {
      let transDate = '-';
      if (item.transactions.length)
        transDate = moment(item.transactions[0].date).format('LL');
      const card = el('div', { class: 'account-card' }, [
        el('div', [
          el('div', item.account, { class: 'account-number' }),
          el(
            'div',
            accounting.formatMoney(
              item.balance,
              '\u20bd',
              2,
              ' ',
              ',',
              '%v %s',
            ),
            { class: 'account-balance' },
          ),
        ]),
        el('div', { class: 'account-transaction' }, [
          el('div', { class: 'account-transaction__wrap' }, [
            el('span', 'Последняя транзакция:', {
              class: 'account-transaction__text',
            }),
            el('span', transDate, {
              class: 'account-transaction__time',
            }),
          ]),
          el('a', 'Открыть', {
            class: 'btn btn-primary account-open',
            href: `/accounts/about-card?id=${item.account}`,
          }),
        ]),
      ]);
      mount(listAccounts, card);
    }
  }

  mount(main, listAccounts);
}

export function validErrNewAccount(data) {
  if (data.payload === null) {
    if (data.error === 'Invalid route') {
      btnAddAccountError.style.display = 'inline';
      setInterval(() => {
        btnAddAccountError.style.display = 'none';
      }, DELAY_MS);
    }
  }
}
