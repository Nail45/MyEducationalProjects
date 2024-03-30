import { el, mount, setChildren } from 'redom';
import { accounting } from 'accounting';
import moment from 'moment';
import { Pagination } from 'pure-paginator';
import '../styles/balance.scss';
import { getId } from './main.js';
import {
  // canvasWrapBalance,
  createGraph, // getChartBalance,
  // canvasWrapBalance,
  // getChartTransactions,
  // canvasWrapTransactions,
} from './chart.js';
import dragula from 'dragula';
import { btnSwitchDrag } from './currency.js';

const tablePaginationWrapper = el('div', {
  class: 'table-pagination-wrapper',
});
const lookAccountBalance = el('div', { class: 'look-account' });
const backAccountBalance = el('div', { class: 'back-account' });
const dynamicBalance = el('div', { class: 'dynamic balance-dynamic' });
const transactionBalance = el('div', {
  class: 'dynamic balance-dynamic',
});
const transferHistoryWrap = el('div', {
  class: 'transfer-history content-wrapper',
});

const balanceWrap = el('div', { class: 'about-balance-wrap' }, [
  dynamicBalance,
  transactionBalance,
  transferHistoryWrap,
]);

export function renderBalance(data) {
  balanceCard.innerHTML = '';
  const id = getId();

  const backLink = el('a', 'Вернуться назад', {
    class: 'btn btn-primary back-account__link',
    href: `/accounts/about-card?id=${id}`,
  });

  setChildren(
    lookAccountBalance,
    el(
      'div',
      'История баланса',
      {
        class: 'look-account__title',
      },
      [btnSwitchDrag],
    ),
    el('div', `№ ${data.payload.account}`, { class: 'look-account__number' }),
  );
  setChildren(
    backAccountBalance,
    backLink,
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
  );

  const dataAccount = el('div', { class: 'data-account' }, [
    lookAccountBalance,
    backAccountBalance,
  ]);

  const canvasDynamic = el('canvas', { id: 'canvas-dynamic' });
  const canvasWrapDynamic = el('div', [canvasDynamic]);
  const canvasTransactions = el('canvas', { id: 'canvas-dynamic' });
  const canvasWrapTransactions = el('div', [canvasTransactions]);

  createGraph(canvasDynamic, data, 12, false);
  createGraph(canvasTransactions, data, 12, true);

  setChildren(
    dynamicBalance,
    el('div', 'Динамика баланса', { class: 'dynamic-title' }),
    canvasWrapDynamic,
  );
  setChildren(
    transactionBalance,
    el('div', 'Соотношение входящих исходящих транзакций', {
      class: 'dynamic-title',
    }),
    canvasWrapTransactions,
  );

  function getTransferHistoryTable(data) {
    const tBody = el('tbody', { class: 'table-body' });
    for (let i = data.payload.transactions.length - 1; i >= 0; i--) {
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
        const itemTr = el('tr', { class: 'transfer-table__tr-body' }, [
          el('td', `${item.from}`, { class: 'transfer-table__td' }),
          el('td', `${item.to}`, { class: 'transfer-table__td' }),
          amountEl,
          el('td', `${moment(item.date).format('L')} `, {
            class: 'transfer-table__td',
          }),
        ]);
        mount(tBody, itemTr);
      }
    }

    const tablePagination = new Pagination(
      tBody,
      tablePaginationWrapper,
      1,
      25,
    );
    tablePagination.reindexPagination();

    const transferHistoryTable = el(
      'table',
      { class: 'transfer-table transfer-table-balance' },
      [
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
      ],
    );

    return transferHistoryTable;
  }

  setChildren(
    transferHistoryWrap,
    el('div', 'История переводов', { class: 'transfer-history__title' }),
    getTransferHistoryTable(data),
    tablePaginationWrapper,
  );
  setChildren(balanceCard, [dataAccount, balanceWrap]);
}

export const balanceCard = el('section', { class: 'balance-card' });

btnSwitchDrag.addEventListener('click', () => {
  balanceCard.classList.toggle('drag-on');
});

dragula([balanceWrap], {
  moves: () => {
    if (balanceCard.classList.contains('drag-on')) {
      return true;
    } else {
      return false;
    }
  },
});
