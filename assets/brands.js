(function () {
  const intiSlider = (section) => {
    const sliderEl = section.querySelector(".js-slider-brands");
    if (!sliderEl) return;

    const swiperOptions = {
      slidesPerView: "auto",
      spaceBetween: 8,
      mousewheel: {
        forceToAxis: true,
      },
    };

    new Swiper(sliderEl, swiperOptions);
  };

  const initSection = (section) => {
    if (!section || !section?.classList.contains("section-brands")) {
      return;
    }

    intiSlider(section);
  };

  initSection(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSection(event.target);
  });
})();
