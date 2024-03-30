import { el, mount } from 'redom';
import { accounting } from 'accounting';
import { getCurrencyBuy, getCurrencies } from './main.js';
import '../styles/currency.scss';
import { hideSkel } from './skeleton.js';
import { actionEr } from './error.js';
import dragula from 'dragula';

export const currenciesTitle = el('h1', 'Валютный обмен', {
  class: 'currencies-title title',
});

export const btnSwitchDrag = el('button', 'Переместить блоки', {
  class: 'btn btn-outline-primary btn-switchs-drag',
});

const tableYourCurrencies = el('table', { class: 'your-currencies__table' });
const elErrorText = el('span', { class: 'form-exchange__error' });
const currencyExchangeInput = el('input', {
  class: 'form-exchange__input field form-control',
  type: 'number',
  step: '0.01',
});

function closureSocket() {
  socket.close(1000, 'работа закончена');
}

export async function renderYourCurrencies(data, allCurrencies) {
  tableYourCurrencies.innerHTML = '';
  const tableYourCurrenciesContent = el('tbody');
  try {
    for (const currAll of allCurrencies.payload) {
      if (data.payload[currAll].amount > 0) {
        const tr = el('tr', { class: 'your-currencies__row' }, [
          el('th', { class: 'your-currencies__curr' }, [
            el('span', `${data.payload[currAll].code}`, {
              class: 'your-currencies__curr-text',
            }),
          ]),
          el('td', { class: 'your-currencies__value' }, [
            el('span', { class: 'your-currencies__value-cell' }, [
              el(
                'span',
                `${accounting.formatMoney(
                  data.payload[currAll].amount,
                  '',
                  2,
                  ' ',
                  '.',
                  '%v %s',
                )}`,
                {
                  class: 'your-currencies__cell-text',
                },
              ),
            ]),
          ]),
        ]);
        mount(tableYourCurrenciesContent, tr);
      }
    }
    mount(tableYourCurrencies, tableYourCurrenciesContent);
  } catch (error) {
    console.log(error.name);
    closureSocket();
    actionEr(error);
  }
}

export async function renderCurrencyExchange(data, allCurrencies) {
  const currencyExchangeFrom = el('select', {
    class: 'form-exchange__form field form-select',
  });
  const currencyExchangeTo = el('select', {
    class: 'form-exchange__to field form-select',
  });

  const currencyExchangeBtn = el('button', 'Обменять', {
    class: 'form-exchange__btn btn btn-primary',
  });

  currencyExchangeInput.addEventListener('input', () => {
    currencyExchangeInput.classList.remove('is-invalid');
    elErrorText.style.display = 'none';
  });

  function addOptionsToSelect() {
    for (const option of allCurrencies.payload) {
      const options = el('option', `${option}`);
      if (currencyExchangeFrom.value === option) continue;
      mount(currencyExchangeTo, options);
    }
  }

  for (const option of allCurrencies.payload) {
    const options = el('option', `${option}`);
    mount(currencyExchangeFrom, options);
  }
  addOptionsToSelect();

  currencyExchangeFrom.addEventListener('change', () => {
    currencyExchangeTo.innerHTML = '';
    addOptionsToSelect();
  });

  const formExchange = el('form', { class: 'form-exchange' }, [
    el('div', { class: 'form-exchange__wrap' }, [
      el('div', { class: 'form-exchange__curr' }, [
        el('label', 'Из', { class: 'form-exchange__label' }),
        currencyExchangeFrom,
        el('label', 'в', { class: 'form-exchange__label' }),
        currencyExchangeTo,
      ]),
      el('div', { class: 'form-exchange__value' }, [
        el('label', 'Сумма', { class: 'form-exchange__label' }),
        elErrorText,
        currencyExchangeInput,
      ]),
    ]),
    currencyExchangeBtn,
  ]);
  mount(currenciesExchange, formExchange);

  formExchange.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currencyExchangeInput.value !== '') {
      getCurrencyBuy(
        currencyExchangeFrom.value,
        currencyExchangeTo.value,
        currencyExchangeInput.value,
      );
      formExchange.innerHTML = '';
      getCurrencies();
    } else false;
  });

  currencyExchangeInput.value = '';
}

export const currenciesYours = el(
  'div',
  { class: 'currencies-yours dynamic' },
  [
    el('div', 'Ваши валюты', { class: 'currencies-yours__title' }),
    tableYourCurrencies,
  ],
);

export const currenciesExchange = el(
  'div',
  { class: 'currencies-exchange dynamic' },
  [
    el('div', 'Обмен валюты', { class: 'currencies-yours__title' }),
    el('div', { class: 'form-content' }),
  ],
);

const currenciesWrap = el('div', { class: 'currencies-wrap' }, [
  currenciesYours,
  currenciesExchange,
]);

export function checkCurrencyBuy(data) {
  const errorMessage = {
    'Unknown currency code':
      'Неверный валютный код списания или валютный код зачисления',
    'Invalid amount': 'Сумма перевода должна быть больше 0',
    'Not enough currency': 'На валютном счёте списания нет средств',
    'Overdraft prevented': 'Недостаточно средств',
    'Invalid route': 'Возникла не предвиденная ошибка попробуйте позже',
    Unauthorized: 'Вы не можете совершить данный обмен',
  };

  function showError(text) {
    currencyExchangeInput.classList.add('is-invalid');
    elErrorText.style.display = 'block';
    elErrorText.textContent = text;
  }

  if (data.error) showError(errorMessage[data.error]);
}

// Раздел курсов валют

const socket = new WebSocket(`ws://localhost:3000/currency-feed`);

if (window.location.pathname === '/currencies') {
  socket.onmessage = function openSocket(event) {
    const data = JSON.parse(event.data);
    const tr = el('tr', { class: 'currencies-rate__tr' }, [
      el('th', { class: 'currencies-rate__head' }, [
        el('span', { class: 'currencies-rate__head-content' }, [
          el('span', `${data.from}/${data.to}`, {
            class: 'currencies-rate__head-text',
          }),
        ]),
      ]),
      el('td', { class: 'currencies-rate__data' }, [
        el('span', `${data.rate}`, { class: 'currencies-rate__data-text' }),
      ]),
    ]);
    hideSkel([currenciesRate]);
    document.querySelector('.currencies-rate__tBody').prepend(tr);

    const line = document.querySelector('.currencies-rate__head-content');
    const arrow = document.querySelector('.currencies-rate__data-text');

    switch (`${data.change}`) {
      case '1':
        line.classList.add('green');
        arrow.classList.add('green');
        break;
      case '-1':
        line.classList.add('red');
        arrow.classList.add('red');
        break;
      default:
        line.classList.add('black');
        arrow.classList.add('black');
        break;
    }
  };
}

socket.onclose = function () {
  const errorEl = el(
    'div',
    'Возникла не большая ошибка, попробуйте немного позднее',
    {
      class: 'currencies-rate__tBody-error',
    },
  );
  tBodyCurrenciesRate.append(errorEl);
};

const tBodyCurrenciesRate = el('tbody', { class: 'currencies-rate__tBody' });
const tableCurrenciesRate = el('table', { class: 'currencies-rate__table' }, [
  tBodyCurrenciesRate,
]);

export const currenciesRate = el('div', { class: 'currencies-rate' }, [
  el('div', 'Изменение курсов в реальном времени', {
    class: 'currencies-yours__title',
  }),
  tableCurrenciesRate,
]);

const currenciesYoursWrap = el('div', { class: 'currencies-yours__wrap' }, [
  currenciesWrap,
  currenciesRate,
]);

export const currencies = el('section', { class: 'currencies' }, [
  currenciesTitle,
  btnSwitchDrag,
  currenciesYoursWrap,
]);

btnSwitchDrag.addEventListener('click', () => {
  currencies.classList.toggle('drag-on');
});

// const leftContainer = [];
dragula([currenciesYoursWrap], {
  moves: () => {
    if (currencies.classList.contains('drag-on')) {
      return true;
    } else {
      return false;
    }
  },
});
// .on('drag', () => {
//   leftContainer.length = 0;
//   leftContainer.push(currenciesRate.offsetLeft, currenciesRate.offsetTop);
//   localStorage.setItem('range', JSON.stringify(leftContainer));
// });

// const a = JSON.parse(localStorage.getItem('range'));
// if (a) {
//   currenciesRate.style.left = a[0] + 'px';
//   currenciesRate.style.top = a[1] + 'px';
// }
