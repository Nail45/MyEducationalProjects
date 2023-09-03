const swiper = new Swiper('.js-hero-slider', {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: '.js-hero-pagination',
    clickable: true,
  },

  a11y: {
    paginationBulletMessage: 'Перейти к слайду {{index}}'
  }
});




document.querySelectorAll('.work__list-btn').forEach(function (tabsBtn) {
  tabsBtn.addEventListener('click', function (e) {
    const path = e.currentTarget.dataset.path;
    document.querySelectorAll('.work__list-btn').forEach(function (btn) {
      btn.classList.remove('work__btn--active')
    });
    e.currentTarget.classList.add('work__btn--active');

    document.querySelectorAll('.work__wrapper').forEach(function (tabsBtn) {
      tabsBtn.classList.remove('work__wrapper--active')
    });
    document.querySelector(`[data-target="${path}"]`).classList.add('work__wrapper--active');
  });
});

