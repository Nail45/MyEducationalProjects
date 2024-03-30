import { el, mount } from 'redom';
import '../styles/error.scss';
import { main } from './list-card';

export function actionEr(error) {
  const errors = {
    SyntaxError:
      'Возникла не предвиденная ошибка перезагрузите страницу или попробуйте позднее',
    TypeError:
      'Возникла не большая проблема, попробуйте перезагрузить страницу или заново войти в личный кабинет',
  };
  function createErrorElem(text) {
    const er = el('h1', text, {
      class: 'error-type',
    });

    mount(document.body, er);
  }

  createErrorElem(errors[error.name]);
  document.querySelector('.error-type');

  main.innerHTML = '';
}
