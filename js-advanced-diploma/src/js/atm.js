/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { el, mount } from 'redom';
import { getBanks } from './main.js';
import '../styles/atm.scss';
import { hideSkel, showSkel } from './skeleton.js';
import { ATMbtn, accountbtn, currencybtn, exitbtn } from './list-card.js';
import { logoIcon } from './header.js';
import { actionEr } from './error.js';

export const atmTitle = el('h1', 'Карта банкоматов', {
  class: 'atm-title title',
});

export const head = document.querySelector('head');
const scriptMap = el('script', {
  src: 'https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU',
  type: 'text/javascript',
});

mount(head, scriptMap);

const map = el('div', { id: 'map', class: 'atm-map' });

export const atm = el('section', { class: 'atm' }, [atmTitle, map]);

export async function renderMap() {
  showSkel([logoIcon, ATMbtn, accountbtn, currencybtn, exitbtn, atmTitle, map]);
  window.addEventListener('load', async () => {
    hideSkel([map]);
    const banks = await getBanks();
    ymaps.ready(init);
    function init() {
      const mapElem = document.querySelector('#map');
      const myMap = new ymaps.Map('map', {
        center: [55.756405900657555, 37.61192406057117],
        zoom: 12,
      });

      myMap.behaviors.disable('scrollZoom');

      const myGeoObjects = new ymaps.GeoObjectCollection(
        {},
        {
          strokeWidth: 4,
          geodesic: true,
        },
      );

      for (const bank of banks.payload) {
        myGeoObjects.add(new ymaps.Placemark([bank.lat, bank.lon]));
        myMap.geoObjects.add(myGeoObjects);
      }

      myMap.container.fitToViewport();
    }
  });
}
