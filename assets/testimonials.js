(function () {
  const initSlider = (section) => {
    const slider = section.querySelector(".testimonials__swiper");

    if (!slider) return;

    const columns = Number(slider.dataset.columns);
    const columnsConfig = {
      4: {
        750: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
        1360: { slidesPerView: 4 },
      },
      3: {
        750: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
      2: {
        750: { slidesPerView: 2 },
      },
      1: {
        576: { slidesPerView: 1 },
      },
    };

    const nextBtn = section.querySelector(
      ".testimonials__navigation-button-next"
    );
    const prevBtn = section.querySelector(
      ".testimonials__navigation-button-prev"
    );

    const testimonialsSwiper = new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 8,
      loop: false,
      speed: 800,
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: columnsConfig[columns],
    });
  };

  initSlider(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSlider(event.target);
  });
})();
