(function () {
  const intiSlider = (section) => {
    const parentEl = section.querySelector(".featured-collection");
    const sliderEl = section.querySelector(".js-swiper-featured-collection");
    if (!sliderEl || !parentEl) return;

    const prevBtn = section.querySelector(".swiper-button-prev");
    const nextBtn = section.querySelector(".swiper-button-next");
    const isOnlyProducts = parentEl.classList.contains(
      "featured-collection--only_products"
    );
    const isDoublePromo = parentEl.classList.contains(
      "featured-collection--products_with_double_promo"
    );

    const mobileColumns = Number(sliderEl.dataset.mobileColumn || 1);

    const swiperOptions = {
      slidesPerView: isOnlyProducts ? "auto" : mobileColumns,
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
        576: {
          slidesPerView: isOnlyProducts ? "auto" : 2,
        },
        750: {
          slidesPerView: isOnlyProducts ? "auto" : 3,
        },
        990: {
          slidesPerView: isOnlyProducts ? "auto" : isDoublePromo ? 1 : 2,
        },
        1100: {
          slidesPerView: isOnlyProducts ? "auto" : 2,
        },
        1600: {
          slidesPerView: isOnlyProducts ? "auto" : 3,
        },
      },
    };

    new Swiper(sliderEl, swiperOptions);
  };

  const initSection = (section) => {
    if (
      !section ||
      !section?.classList.contains("featured-collection-section")
    ) {
      return;
    }

    intiSlider(section);
  };

  initSection(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSection(event.target);
  });
})();
