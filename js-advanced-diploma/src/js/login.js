import { el } from 'redom';
import '../styles/login.scss';

export const inputLogin = el('input', {
  class: 'header-form__input form-control',
  placeholder: 'Введите логин',
  // value: 'developer',
  type: 'text',
});

export const inputPass = el('input', {
  class: 'header-form__input form-control',
  placeholder: 'Введите пароль',
  type: 'password',
  // value: 'skillbox',
  autocomplete: 'off',
});

const loginInvalid = el('span', {
  class: 'login-invalid',
});

const passwordInvalid = el('span', {
  class: 'login-invalid',
});

export const btnLogin = el('a', 'Войти', {
  class: 'btn btn-primary header-btn',
  type: 'submit',
});

const invalidMessage = {
  'Invalid password': 'Пароль не верен',
  'No such user': 'Логин не верен',
};

export function validForm(data) {
  if (data.payload === null) {
    if (data.error === 'No such user') {
      addClassInvalid(inputLogin, loginInvalid, invalidMessage[data.error]);
    }
    if (data.error === 'Invalid password') {
      addClassInvalid(inputPass, passwordInvalid, invalidMessage[data.error]);
    }
  }
}

export const form = el('section', { class: 'page-authorization' }, [
  el('div', { class: 'container' }, [
    el('div', { class: 'authorization' }, [
      el('h1', 'Вход в аккаунт', { class: 'header-title' }),
      el('form', { class: 'header-form' }, [
        el('label', { class: 'header-form__label header-form__label-login' }, [
          el('span', 'Логин', { class: 'header-form__text' }),
          inputLogin,
          loginInvalid,
        ]),
        el(
          'label',
          { class: 'header-form__label header-form__label-password' },
          [
            el('span', 'Пароль', { class: 'header-form__text' }),
            inputPass,
            passwordInvalid,
          ],
        ),
        btnLogin,
      ]),
    ]),
  ]),
]);

export function addClassInvalid(log, logInv, text) {
  log.classList.add('is-invalid');
  logInv.style.display = 'block';
  logInv.textContent = text;
}

function removeClassInvalid(log, logInv, text) {
  log.classList.remove('is-invalid');
  logInv.style.display = 'none';
  logInv.textContent = text;
}

inputLogin.addEventListener('blur', () => {
  if (inputLogin.value.length < 5)
    addClassInvalid(
      inputLogin,
      loginInvalid,
      'Логин должен быть не менее 6 символов',
    );
});

inputLogin.addEventListener('input', () => {
  removeClassInvalid(inputLogin, loginInvalid);
});

inputPass.addEventListener('blur', () => {
  if (inputPass.value.length < 5)
    addClassInvalid(
      inputPass,
      passwordInvalid,
      'Пароль должен быть не менее 6 символов',
    );
});

inputPass.addEventListener('input', () => {
  removeClassInvalid(inputPass, passwordInvalid);
});
