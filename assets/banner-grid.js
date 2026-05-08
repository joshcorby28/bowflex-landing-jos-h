(function () {
  const initSlider = (section) => {
    const slider = section.querySelector('.cards-grid-items-container--slider');

    if (slider) {
      const columns = Number(slider.dataset.columns);

      const columnsConfig = {
        6: {
          990: { slidesPerView: 2 },
          750: { slidesPerView: 3 },
          1360: { slidesPerView: 6 },
        },
        5: {
          990: { slidesPerView: 2 },
          750: { slidesPerView: 3 },
          1600: { slidesPerView: 5 },
        },
        4: {
          990: { slidesPerView: 2 },
          1360: { slidesPerView: 4 },
        },
        3: {
          990: { slidesPerView: 2 },
          1360: { slidesPerView: 3 },
        },
        2: {
          990: { slidesPerView: 2 },
        },
        1: {
          576: { slidesPerView: 1 },
        },
      };

      sliderSettings = {
        slidesPerView: Number(slider.dataset.mobileColumn),
        spaceBetween: 8,
        speed: 500,
        allowTouchMove: true,
        mousewheel: {
          forceToAxis: true,
        },
        navigation: {
          nextEl: section.querySelector('.cards-grid__navigation-button-next'),
          prevEl: section.querySelector('.cards-grid__navigation-button-prev'),
          disabledClass: "swiper-button-disabled",
        },
        breakpoints: columnsConfig[columns]
      };

      new Swiper(
        slider,
        sliderSettings
      );
    }
  }

  initSlider(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSlider(event.target);
  });
})()