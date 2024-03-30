import { el, mount } from 'redom';
import '../styles/skeleton.scss';

export const accountCardsWrap = el('section', {
  class: 'list-accounts list-accounts__skel',
});
for (let i = 0; i < 9; i++) {
  const accountCardsEl = el('div', { class: 'account-card skeleton' });
  mount(accountCardsWrap, accountCardsEl);
}

export const aboutCardSkeleton = el('section', { class: 'about-card' }, [
  el('div', { class: 'data-account' }, [
    el('div', { class: 'look-account-skel skeleton' }),
    el('div', { class: 'back-account-skel skeleton' }),
  ]),
  el('div', { class: 'transfer-skeleton-wrap' }, [
    el('div', { class: 'transfer' }, [
      el('div', { class: 'new-transfer skeleton' }),
      el('div', { class: 'dynamic skeleton' }),
    ]),
    el('div', { class: 'transfer-history transfer-history-skel skeleton' }),
  ]),
]);

export function showSkel(obj) {
  obj.forEach((element) => {
    element.classList.add('skeleton');
  });
}

export function hideSkel(obj) {
  obj.forEach((element) => {
    element.classList.remove('skeleton');
  });
}
