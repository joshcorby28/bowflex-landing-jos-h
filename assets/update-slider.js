(function () {
  function swiperInit(section) {
    if (!section) return;
    const galleryWrapper = section.querySelector(".product__main");
    if (!galleryWrapper) return;
    const galleryLayout = galleryWrapper.dataset.layout || "gallery";
    const galleryLayoutMobile = galleryWrapper.dataset.layoutMobile || "slider";

    let isSwiperActive = false;
    function checkAndToggleSlider(entry) {
      const viewportWidth = window.innerWidth;

      const shouldEnableSlider =
        (viewportWidth < 990 && galleryLayoutMobile === "slider") ||
        (viewportWidth >= 990 && galleryLayout === "slider");

      if (shouldEnableSlider && !isSwiperActive) {
        subSliderInit(section);
        sliderInit(section);

        isSwiperActive = true;
      } else if (!shouldEnableSlider && isSwiperActive) {
        subSliderDestroy(section);
        sliderDestroy(section);

        isSwiperActive = false;
      }
    }

    let resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(checkAndToggleSlider);
    });

    resizeObserver.observe(section);
    popupSliderInit(section);
  }

  document.addEventListener("shopify:section:load", function (e) {
    swiperInit(e.target);
  });

  swiperInit(document.currentScript?.parentElement);
})();
