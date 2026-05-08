(function () {
  const initSlider = (section) => {
    const box = section.querySelector(".multicolumn");
    const slider = section.querySelector(".swiper--multicolumn");

    if (!slider) return;

    const slides = slider.querySelectorAll(".multicolumn-card");

    slides.forEach((slide) => {
      slide.classList.add("swiper-slide");
    });

    const nextBtn = box.querySelector(".multicolumn__navigation-button-next");
    const prevBtn = box.querySelector(".multicolumn__navigation-button-prev");

    new Swiper(slider, {
      loop: false,
      slidesPerView: "auto",
      spaceBetween: 8,
      speed: 800,
      watchSlidesProgress: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      }
    });
  };

  const destroySlider = (section) => {
    const slider = section.querySelector(".swiper--multicolumn");
    const slides = section.querySelectorAll(".multicolumn-card");

    if (slider?.swiper) slider.swiper.destroy();

    slides.forEach((slide) => {
      slide.removeAttribute("style");
      slide.classList.remove("swiper-slide");
    });
  };

  const initMulticolumn = (section) => {
    if (!section || !section?.classList.contains("multicolumn-section")) return;

    const box = section.querySelector(".multicolumn");

    if (!box) return;

    const hasMobileSlider =
      box.getAttribute("data-enable-mobile-slider") === "true";

    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;

      if (entry.contentRect.width < 576 && hasMobileSlider) {
        initSlider(section);
      }
      else {
        destroySlider(section);
      }
    });

    sectionResizeObserver.observe(section);
  };

  initMulticolumn(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initMulticolumn(event.target);
  });
})();
