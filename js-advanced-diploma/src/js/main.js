import { mount, setChildren, unmount } from 'redom';
import '../styles/style.scss';
import { header, logoIcon } from './header.js';
import { form, inputLogin, inputPass, btnLogin, validForm } from './login.js';
import { aboutCard, renderCard, checkTransfer } from './about-card.js';
import {
  listNav,
  accountbtn,
  main,
  getListCards,
  btnAddAccount,
  currencybtn,
  ATMbtn,
  accounts,
  listAccounts,
  exitbtn,
  sortWrapEl,
  validErrNewAccount,
} from './list-card.js';
import {
  currencies,
  renderYourCurrencies,
  renderCurrencyExchange,
  checkCurrencyBuy,
  currenciesTitle,
  currenciesYours,
  currenciesExchange,
  currenciesRate,
} from './currency.js';
import {
  aboutCardSkeleton,
  accountCardsWrap,
  hideSkel,
  showSkel,
} from './skeleton.js';
import { balanceCard, renderBalance } from './balance.js';
import { atm, atmTitle, renderMap } from './atm.js';
import Navigo from 'navigo';
import { actionEr } from './error.js';

window.addEventListener('load', () => {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
});

const URL = 'http://localhost:3000';

setChildren(document.body, [header, form, main]);

const router = new Navigo('/');

btnLogin.addEventListener('click', async () => {
  await fetch(`${URL}/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      login: inputLogin.value.trim(),
      password: inputPass.value.trim(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.payload) {
        localStorage.setItem('auth', JSON.stringify(data.payload.token));
        window.location.href = '/accounts';
      } else {
        validForm(data);
      }
    });
});
const TOKEN = JSON.parse(localStorage.getItem('auth'));

async function getAccounts() {
  listAccounts.style.display = 'none';
  mount(document.body, accountCardsWrap);
  showSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
  ]);
  try {
    await fetch(`${URL}/accounts`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        getListCards(data);
      });
  } catch (error) {
    actionEr(error);
  }
  listAccounts.style.display = 'grid';
  unmount(document.body, accountCardsWrap);
  hideSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
  ]);
}

btnAddAccount.addEventListener('click', async () => {
  await fetch(`${URL}/create-account`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      validErrNewAccount(data);
    });
});

export async function getAccountByID(id) {
  showSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
  ]);
  unmount(main, aboutCard);
  mount(main, aboutCardSkeleton);
  try {
    await fetch(`${URL}/account/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (window.location.pathname === '/accounts/about-card') {
          mount(main, aboutCard);
          renderCard(data);
        } else {
          renderBalance(data);
        }
      });
  } catch (error) {
    actionEr(error);
    console.log(error);
    // console.log(barCanvasBalance);
    // console.log(error, 'canvas');
  }
  hideSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
  ]);
  unmount(main, aboutCardSkeleton);
}

export async function getBanks() {
  try {
    const banks = await fetch(`${URL}/banks`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    hideSkel([logoIcon, ATMbtn, accountbtn, currencybtn, exitbtn, atmTitle]);
    return banks;
  } catch (error) {
    actionEr(error);
  }
}

async function getCurrenciesAll() {
  const allCurrencies = await fetch(`${URL}/all-currencies`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return allCurrencies;
}

export async function getCurrencies() {
  showSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
    currenciesTitle,
    currenciesYours,
    currenciesExchange,
    currenciesRate,
  ]);
  try {
    const currenciesAll = await getCurrenciesAll();
    await fetch(`${URL}/currencies`, {
      headers: {
        Authorization: `Basic ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        renderYourCurrencies(data, currenciesAll);
        renderCurrencyExchange(data, currenciesAll);
      });
  } catch (error) {
    actionEr(error);
  }
  hideSkel([
    logoIcon,
    ATMbtn,
    accountbtn,
    currencybtn,
    exitbtn,
    sortWrapEl,
    btnAddAccount,
    currenciesTitle,
    currenciesYours,
    currenciesExchange,
    currenciesRate,
  ]);
}

export async function getCurrencyBuy(from, to, amount) {
  try {
    await fetch(`${URL}/currency-buy`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Basic ${TOKEN}`,
      },
      body: JSON.stringify({
        from: from,
        to: to,
        amount: amount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        checkCurrencyBuy(data);
      });
  } catch (error) {
    actionEr(error);
  }
}

export async function makeTransferFunds(from, to, amount) {
  await fetch(`${URL}/transfer-funds`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Basic ${TOKEN}`,
    },
    body: JSON.stringify({
      from: from,
      to: to,
      amount: amount,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      checkTransfer(data);
      console.log(data);
    });
}

export function getId() {
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  return id;
}

const id = getId();

router.on('/accounts', () => {
  try {
    getAccounts();
    mount(header, listNav);
    mount(main, accounts);
    unmount(document.body, form);
    accountbtn.classList.add('active-now');
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка');
  }
});

router.on('/accounts/about-card', () => {
  getAccountByID(id);
  mount(header, listNav);
  unmount(document.body, form);
});

router.on('/accounts/about-card/balance', () => {
  getAccountByID(id);
  mount(header, listNav);
  mount(main, balanceCard);
  unmount(main, accounts);
  unmount(document.body, form);
});

router.on('/currencies', () => {
  getCurrencies();
  mount(header, listNav);
  mount(main, currencies);
  unmount(main, accounts);
  unmount(document.body, form);
  currencybtn.classList.add('active-now');
});

router.on('/atm', () => {
  renderMap();
  mount(header, listNav);
  mount(main, atm);
  unmount(main, accounts);
  unmount(document.body, form);
  ATMbtn.classList.add('active-now');
});

router.resolve();
