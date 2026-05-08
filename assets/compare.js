(function () {
  const intiSlider = (section) => {
    const sliderEl = section.querySelector(".js-slider-compare-products");
    if (!sliderEl) return;

    const prevBtn = section.querySelector(".swiper-button-prev");
    const nextBtn = section.querySelector(".swiper-button-next");

    const swiperOptions = {
      slidesPerView: 1,
      spaceBetween: 8,
      speed: 800,
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      breakpoints: {
        //576: {
        //  slidesPerView: 2,
        //},
        750: {
          slidesPerView: 2,
        },
        990: {
          slidesPerView: 1,
        },
      },
    };

    new Swiper(sliderEl, swiperOptions);
  };

  const initSection = (section) => {
    if (!section || !section?.classList.contains("section-compare")) {
      return;
    }

    intiSlider(section);
  };

  initSection(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSection(event.target);
  });
})();
