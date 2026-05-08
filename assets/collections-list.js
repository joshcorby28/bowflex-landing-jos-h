(function () {
  let swiperCollectionsList;

  function updateFadeShadows(containerEl, swiper) {
    if (swiper.isEnd) {
      containerEl.classList.remove("has-right-shadow");

      if (swiper.isBeginning) {
        containerEl.classList.remove("has-left-shadow");
      } else {
        containerEl.classList.add("has-left-shadow");
      }
    } else {
      containerEl.classList.add("has-right-shadow");
      containerEl.classList.remove("has-left-shadow");
    }
  }

  const placeButtons = (slideImg, nextBtn, prevBtn) => {
    const imgCenter = slideImg.getBoundingClientRect().height / 2;
    const btnTop = imgCenter - 22;

    nextBtn.style.top = btnTop + "px";
    nextBtn.style.transform = "none";

    prevBtn.style.top = btnTop + "px";
    prevBtn.style.transform = "none";
  };

  const initSlider = (section) => {
    const sliderContainer = section.querySelector(".collections-list__layout");

    if (!sliderContainer || !sliderContainer.dataset.collectionsListSlider)
      return;

    const swiperEl = section.querySelector(".collections-list__layout.swiper");
    const nextBtn = section.querySelector(
      ".collections-list__nav-button--next"
    );
    const prevBtn = section.querySelector(
      ".collections-list__nav-button--prev"
    );
    const containerEl = section.querySelector(".collections-list__container");
    const slideImg = swiperEl.querySelector(".collections-list__image");

    if (!swiperEl || !containerEl) return;

    const isColumnLayout = sliderContainer.dataset.cardLayout === "column";
    const canPlaceButtons = Boolean(
      isColumnLayout && slideImg && nextBtn && prevBtn
    );

    swiperCollectionsList = new Swiper(swiperEl, {
      slidesPerView: Number(sliderContainer.dataset.mobileColumns),
      spaceBetween: 8,
      loop: false,
      speed: 800,
      allowTouchMove: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        576: {
          slidesPerView: Number(sliderContainer.dataset.smColumns),
        },
        750: {
          slidesPerView: Number(sliderContainer.dataset.mdColumns),
        },
        990: {
          slidesPerView: Number(sliderContainer.dataset.lgColumns),
        },
        1200: {
          slidesPerView: Number(sliderContainer.dataset.xlColumns),
        },
        1360: {
          slidesPerView: Number(sliderContainer.dataset.xxlColumns),
        },
        1600: {
          slidesPerView: Number(sliderContainer.dataset.desktopColumns),
        },
      },
      on: {
        init(swiper) {
          updateFadeShadows(containerEl, swiper);

          if (canPlaceButtons) {
            placeButtons(slideImg, nextBtn, prevBtn);
          }
        },
        slideChange(swiper) {
          updateFadeShadows(containerEl, swiper);
        },
        resize(swiper) {
          updateFadeShadows(containerEl, swiper);

          if (canPlaceButtons) {
            placeButtons(slideImg, nextBtn, prevBtn);
          }
        },
      },
    });
  };

  const initCollectionsList = (section) => {
    if (!section || !section?.classList.contains("section-collections-list"))
      return;

    initSlider(section);
  };

  initCollectionsList(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initCollectionsList(event.target);
  });
})();
