import { el } from 'redom';
import logo from '../assets/images/Logo.svg';
import '../styles/header.scss';

export const logoIcon = el('a', { class: 'header-link', href: '#' }, [
  el('img', { class: 'header-logo', src: logo }),
]);

export const header = el('header', { class: 'header' }, [logoIcon]);
