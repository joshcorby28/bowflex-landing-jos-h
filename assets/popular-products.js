(function () {
  let swiperPopularProducts;

  const initSlider = (section) => {
    if (!section || !section?.classList.contains("popular-products-section"))
      return;

    const sliderContainer = section.querySelector(".popular-products");
    if (!sliderContainer) return;

    const columns = Number(sliderContainer.dataset.columns);

    const columnsConfig = {
      6: {
        576: { slidesPerView: 2 },
        750: { slidesPerView: 3 },
        990: { slidesPerView: 4 },
        1360: { slidesPerView: 6 },
      },
      5: {
        576: { slidesPerView: 2 },
        750: { slidesPerView: 3 },
        1360: { slidesPerView: 5 },
      },
      4: {
        576: { slidesPerView: 2 },
        1200: { slidesPerView: 4 },
      },
      3: {
        576: { slidesPerView: 2 },
        750: { slidesPerView: 3 },
      },
      2: {
        576: { slidesPerView: 2 },
      },
      1: {
        576: { slidesPerView: 1 },
      },
    };

    const swiperEl = section.querySelector(
      ".popular-products__layout:not(.swiper-initialized)"
    );
    const swiperWrapper = section.querySelector(".popular-products__list");
    const slides = section.querySelectorAll(".popular-products__item");
    const nextBtns = section.querySelectorAll(
      ".popular-products__navigation-button-next"
    );
    const prevBtns = section.querySelectorAll(
      ".popular-products__navigation-button-prev"
    );

    if (!swiperEl || !swiperWrapper || !slides || !slides.length) return;

    swiperEl.classList.add("swiper");
    swiperWrapper.classList.add("swiper-wrapper");

    slides.forEach((slide) => slide.classList.add("swiper-slide"));

    sliderSettings = {
      slidesPerView: Number(sliderContainer.dataset.mobileColumn),
      spaceBetween: 8,
      speed: 800,
      allowTouchMove: true,
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: Array.from(nextBtns),
        prevEl: Array.from(prevBtns),
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: columnsConfig[columns],
    };

    swiperPopularProducts = new Swiper(swiperEl, sliderSettings);
  };

  const initPopularProducts = (section) => {
    if (!section || !section?.classList.contains("popular-products-section")) {
      return;
    }
    // init slider if setting enabled and destroy slider if setting disabled
    if (section.querySelector(".js-popular-products-slider")) {
      initSlider(section);
    } else if (swiperPopularProducts) {
      if (typeof swiperPopularProducts.destroy === "function") {
        swiperPopularProducts.destroy();
      }
    }
  };

  initPopularProducts(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initPopularProducts(event.target);
  });
})();
