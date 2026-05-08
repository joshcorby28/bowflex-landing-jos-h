(function () {
  const initSliders = (section) => {
    const swiperEls = section.querySelectorAll(".products-tabs__layout");

    swiperEls.forEach((swiperEl, index) => {
      const swiperWrapper = swiperEl.querySelector(".products-tabs__slider");
      const slides = swiperEl.querySelectorAll(".products-tabs__item");

      if (!swiperWrapper || !slides || !slides.length) return;

      swiperEl.classList.add("swiper");
      swiperWrapper.classList.add("swiper-wrapper");
      slides.forEach((slide) => slide.classList.add("swiper-slide"));

      const nextBtns = section.querySelectorAll(
        `.products-tabs__navigation--${
          index + 1
        } .products-tabs__navigation-button-next`
      );
      const prevBtns = section.querySelectorAll(
        `.products-tabs__navigation--${
          index + 1
        } .products-tabs__navigation-button-prev`
      );

      const columns = Number(
        section.querySelector(".products-tabs").dataset.columns
      );
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

      sliderSettings = {
        slidesPerView: Number(
          section.querySelector(".products-tabs").dataset.mobileColumn
        ),
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

      new Swiper(swiperEl, sliderSettings);
    });
  };

  const toggleTab = (section) => {
    const tabsEls = section.querySelectorAll(".products-tabs__tab");
    const productsEls = section.querySelectorAll(".products-tabs__layout");

    tabsEls.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        if (tab.classList.contains("active")) return;
        const tabId = tab.dataset.productsTabId;

        tabsEls.forEach((el) => {
          el.classList.remove("active");
        });

        productsEls.forEach((el) => {
          el.classList.remove("active");
        });

        const productsActiveEl = section.querySelector(
          `.products-tabs__layout[data-products-tab-id="${tabId}"]`
        );
        tab.classList.add("active");
        productsActiveEl.classList.add("active");

        section
          .querySelectorAll(".products-tabs__navigation")
          .forEach((navigation) => {
            navigation.classList.remove("active");
          });

        section
          .querySelectorAll(
            `.products-tabs__navigation[data-tab-id="${tabId}"]`
          )
          .forEach((navigation) => {
            navigation.classList.add("active");
          });
      });
    });
  };

  const initProductsTabs = (section) => {
    if (!section || !section?.classList.contains("products-tabs-section")) {
      return;
    }

    initSliders(section);
    toggleTab(section);
  };

  initProductsTabs(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initProductsTabs(event.target);
  });
})();
