const sliderInit = (section) => {
  if (!section) return;
  const swiperEls = section.querySelectorAll(".js-media-list");

  if (swiperEls && swiperEls.length > 0) {
    swiperEls.forEach((elem, index) => {
      const swiperWrapper = elem.querySelector(".js-media-wrapper");
      const swiperSlides = elem.querySelectorAll(".js-media-item");

      if (!swiperWrapper || !swiperSlides || swiperSlides.length < 2) return;

      elem.classList.add("swiper");
      swiperWrapper.classList.add("swiper-wrapper");
      swiperSlides.forEach((slide) => {
        slide.classList.add("swiper-slide");
      });

      const navPrev = section.querySelector(
        ".product__slider-nav .swiper-button-prev"
      );
      const navNext = section.querySelector(
        ".product__slider-nav .swiper-button-next"
      );

      const sublist = Array.from(section.querySelectorAll(".js-media-sublist"))[
        index
      ];

      new Swiper(elem, {
        slidesPerView: 1,
        spaceBetween: 2,
        autoHeight: false,
        speed: 500,
        mousewheel: {
          forceToAxis: true,
        },
        navigation: {
          nextEl: navNext,
          prevEl: navPrev,
        },
        thumbs: {
          swiper: sublist ? sublist.swiper : "",
        },
        on: {
          slideChangeTransitionStart: function () {
            if (section.querySelector(".js-media-sublist")) {
              section
                .querySelector(".js-media-sublist")
                .swiper.slideTo(
                  section.querySelector(".js-media-list").swiper.activeIndex
                );
            }
          },
          slideChange: function () {
            window.pauseAllMedia();
            this.params.noSwiping = false;

            if (
              section.querySelector(".js-popup-slider") &&
              section.querySelector(".js-popup-slider").swiper
            ) {
              section
                .querySelector(".js-popup-slider")
                .swiper.slideTo(this.activeIndex);
            }
          },
          slideChangeTransitionEnd: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              this.slides[this.activeIndex]
                .querySelector(".shopify-model-viewer-ui__button--poster")
                .removeAttribute("hidden");
            }
          },
          touchStart: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              if (
                !this.slides[this.activeIndex]
                  .querySelector("model-viewer")
                  .classList.contains("shopify-model-viewer-ui__disabled")
              ) {
                this.params.noSwiping = true;
                this.params.noSwipingClass = "swiper-slide";
              } else {
                this.params.noSwiping = false;
              }
            }
          },
        },
      });
    });
  }
};

const sliderDestroy = (section) => {
  if (!section) return;
  const swiperEls = section.querySelectorAll(".js-media-list");
  if (swiperEls && swiperEls.length > 0) {
    swiperEls.forEach((elem) => {
      const swiperWrapper = elem.querySelector(".js-media-wrapper");
      const swiperSlides = elem.querySelectorAll(".js-media-item");

      if (!swiperWrapper || !swiperSlides) return;
      if (!elem?.swiper) return;

      elem.swiper.destroy(true, true);

      swiperWrapper.classList.remove("swiper");
      swiperWrapper.classList.remove("swiper-wrapper");

      swiperSlides.forEach((slide) => {
        slide.removeAttribute("style");
        slide.classList.remove("swiper-slide");
      });
    });
  }
};

const subSliderInit = (section) => {
  if (!section) return;
  if (
    section.querySelectorAll(".js-media-sublist") &&
    section.querySelectorAll(".js-media-sublist").length > 0
  ) {
    section.querySelectorAll(".js-media-sublist").forEach((elem) => {
      const sliderDirection = elem.dataset.thumbsDirection || "vertical";

      new Swiper(elem, {
        spaceBetween: 2,
        slidesPerView: "auto",
        direction: "horizontal",
        freeMode: true,
        allowTouchMove: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        on: {
          touchEnd: function (s, e) {
            let range = 5;
            let diff = (s.touches.diff = s.isHorizontal()
              ? s.touches.currentX - s.touches.startX
              : s.touches.currentY - s.touches.startY);
            if (diff < range || diff > -range) s.allowClick = true;
          },
        },
        breakpoints: {
          990: {
            slidesPerView: "auto",
            direction: sliderDirection,
          },
        },
      });
    });
  }
};

const subSliderDestroy = (section) => {
  if (!section) return;
  if (
    section.querySelectorAll(".js-media-sublist") &&
    section.querySelectorAll(".js-media-sublist").length > 0
  ) {
    section.querySelectorAll(".js-media-sublist").forEach((elem) => {
      if (!elem?.swiper) return;
      elem.swiper.destroy(true, true);
    });
  }
};

const popupSliderInit = (section) => {
  const sliderWrapper = document.querySelector(".js-popup-slider");

  if (sliderWrapper) {
    const buttonPrev = document.querySelector(
      ".product-media-modal__slider-nav-prev"
    );
    const buttonNext = document.querySelector(
      ".product-media-modal__slider-nav-next"
    );

    let popupSlider = new Swiper(sliderWrapper, {
      slidesPerView: 1,
      speed: 500,
      zoom: {
        maxRatio: 2,
      },
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: buttonNext,
        prevEl: buttonPrev,
      },
      pagination: {
        el: ".product-media-modal .product__pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        990: {
          speed: 750,
        },
      },
      on: {
        afterInit: function () {
          section
            .querySelectorAll(".product__media-list .product__media-item")
            .forEach((elem, index) => {
              elem.addEventListener("click", () => {
                if (sliderWrapper.swiper) {
                  sliderWrapper.swiper.slideTo(index, 0);
                  sliderWrapper.swiper.update();
                }
              });
            });
        },

        slideChange: function () {
          window.pauseAllMedia();
          this.params.noSwiping = false;
          sliderWrapper.classList.remove("zoom");
        },
        touchMove: function () {
          sliderWrapper.classList.remove("zoom");
        },
        slideChangeTransitionEnd: function () {
          if (this.slides[this.activeIndex].querySelector("model-viewer")) {
            this.slides[this.activeIndex]
              .querySelector(".shopify-model-viewer-ui__button--poster")
              .removeAttribute("hidden");
          }
        },
        touchStart: function () {
          if (this.slides[this.activeIndex].querySelector("model-viewer")) {
            if (
              !this.slides[this.activeIndex]
                .querySelector("model-viewer")
                .classList.contains("shopify-model-viewer-ui__disabled")
            ) {
              this.params.noSwiping = true;
              this.params.noSwipingClass = "swiper-slide";
            } else {
              this.params.noSwiping = false;
            }
          }
        },
      },
    });
  }
};

if (navigator.userAgent.indexOf("iPhone") > -1) {
  document
    .querySelector("[name=viewport]")
    .setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1"
    );
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus?.focus();
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
  });
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus && !elementToFocus.classList.contains("card-focused"))
    elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) => {
      this.setMinimumDisable();

      button.addEventListener("click", this.onButtonClick.bind(this));
    });

    var eventList = ["paste", "input"];

    for (event of eventList) {
      this.input.addEventListener(event, function (e) {
        const numberRegex = /^0*?[1-9]\d*$/;

        if (
          numberRegex.test(e.currentTarget.value) ||
          e.currentTarget.value === ""
        ) {
          e.currentTarget.value;
        } else {
          e.currentTarget.value = 1;
        }

        if (e.currentTarget.value === 1 || e.currentTarget.value === "") {
          this.previousElementSibling.classList.add("disabled");
        } else {
          this.previousElementSibling.classList.remove("disabled");
        }
      });
    }

    this.input.addEventListener("focusout", function (e) {
      if (e.currentTarget.value === "") {
        e.currentTarget.value = 1;
      }
    });
  }

  setMinimumDisable() {
    if (this.input.value == 1) {
      this.querySelector('button[name="minus"]').classList.add("disabled");
    } else {
      this.querySelector('button[name="minus"]').classList.remove("disabled");
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);

    this.setMinimumDisable();
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    this.headerWrapper = document.querySelector(".header-wrapper");
    if (this.headerWrapper) this.headerWrapper.preventHide = false;

    this.closeAnimation = this.closeAnimation.bind(this);

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );

    // ---
    // for mobile filters on collection page
    this.querySelectorAll(".mobile-facets__close-button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );

    this.querySelectorAll(".js-mobile-filter-apply-btn").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );

    this.querySelector(".js-mobile-filter-main-apply-btn")?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.closeMenuDrawer(event);
      }
    );
    // ---
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    // prevent if summary is in open mega menu state, see header.js class MegaMenu open()
    if (summaryElement.classList.contains("opened-by-mega-menu")) {
      event.preventDefault();
      return;
    }

    const detailsElement = summaryElement.closest("details");
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();

      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      if (isOpen) {
        detailsElement.classList.remove("menu-opening");
        return;
      }

      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
      });
    }
  }

  openMenuDrawer(summaryElement) {
    if (this.headerWrapper) this.headerWrapper.preventHide = true;
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add("overflow-hidden-drawer");
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");

      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });

      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);

      document.body.classList.remove("overflow-hidden-drawer");

      removeTrapFocus(elementToFocus);

      this.closeAnimation(this.mainDetailsToggle);

      if (this.headerWrapper) this.headerWrapper.preventHide = false;
    }
  }

  onCloseButtonClick(event) {
    event.preventDefault();
    const detailsElement = event.currentTarget.closest("details");
    if (!detailsElement) return;
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement?.classList.remove("menu-opening");
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 275) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
    this.header = document.querySelector(".shopify-section-header");
    this.headerWrapper = document.querySelector(".header-wrapper");

    if (this.headerWrapper) this.headerWrapper.preventHide = false;

    this.closestOverlay = this.closest(".header-row").querySelector(
      ".header-row__overlay"
    );

    this.regionSelector = this.querySelector("#menu-drawer-localization");

    this.regionBackButton = this.querySelector(
      "#menu-drawer-localization-back-btn"
    );

    if (this.regionSelector && this.regionBackButton) {
      this.regionOpenButton = this.regionSelector.querySelector("summary");

      this.regionBackButton.addEventListener("click", () => {
        const isOpen = this.regionSelector.hasAttribute("open");

        if (!isOpen) return;

        this.regionSelector.classList.remove("menu-opening");
        this.closeAnimation(this.regionSelector);
        return;
      });
    }

    this.innerDrawerMenu = this.querySelectorAll(".menu-drawer-inner-drawer");

    this.innerDrawerMenu.forEach((innerDrawer) => {
      const openButton = innerDrawer.querySelector("summary");
      const backBtn = innerDrawer.querySelector(
        ".menu-drawer-inner-drawer-back"
      );

      backBtn?.addEventListener("click", () => {
        const isOpen = innerDrawer.hasAttribute("open");

        if (!isOpen) return;

        innerDrawer.classList.remove("menu-opening");
        this.closeAnimation(innerDrawer);
        return;
      });
    });

    this.onOutsideClick = this.onOutsideClick.bind(this);
    document.addEventListener("click", this.onOutsideClick);
  }

  openMenuDrawer(summaryElement) {
    if (this.headerWrapper) this.headerWrapper.preventHide = true;

    this.closestOverlay?.classList.add(`opened-by-mobile-menu`);

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);

    trapFocus(this.mainDetailsToggle, summaryElement);

    document.body.classList.add(`overflow-hidden-drawer`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");

      this.closestOverlay?.classList.remove(`opened-by-mobile-menu`);

      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });

      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);

      document.body.classList.remove(`overflow-hidden-drawer`);

      removeTrapFocus(elementToFocus);

      this.closeAnimation(this.mainDetailsToggle);

      if (this.headerWrapper) this.headerWrapper.preventHide = false;
    }
  }

  onOutsideClick(event) {
    if (!this.contains(event.target)) {
      if (this.mainDetailsToggle?.hasAttribute("open")) {
        this.closeMenuDrawer(event);
      }
    }
  }
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code && event.code.toUpperCase() === "ESCAPE") {
        this.hide();
      }
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");

    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    let isOpen = false;

    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();

    document.querySelectorAll("body > quick-add-modal").forEach((el) => {
      if (el.hasAttribute("open")) {
        isOpen = true;
      }
    });

    if (!isOpen) {
      document.body.classList.remove("overflow-hidden");
      document.body.dispatchEvent(new CustomEvent("modalClosed"));
    }

    const images = document.querySelector(".product-media-modal__content");

    if (images) {
      images.classList.remove("zoom");

      const zoomedSlide = images.querySelector(
        ".swiper-slide-active.swiper-slide-zoomed"
      );
      if (zoomedSlide) {
        const zoomContainer = zoomedSlide.querySelector(
          ".swiper-zoom-container"
        );
        zoomedSlide.classList.remove("swiper-slide-zoomed");
        const zoomedImg = zoomedSlide.querySelector(".swiper-zoom-target");
        if (zoomContainer && zoomedImg)
          zoomContainer.style.transform = "translate3d(0px, 0px, 0px)";
        zoomedImg.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
      }
    }
  }
}

customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button || button.classList.contains("button-sold-out")) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}

customElements.define("modal-opener", ModalOpener);

class AvaliabilityNotificationModal extends ModalDialog {
  constructor() {
    super();
    this.modal = document.querySelector("avaliability-notification-modal");
    this.opener = null;
    const modalOpenerBtns = document.querySelectorAll(".sold-out-modal-opener");
    modalOpenerBtns.forEach((btn) => {
      btn.addEventListener("click", (evt) => {
        if (evt.target.id !== this.modal.id) return;
        this.opener = evt.target;
        this.modal.show(evt.target);
      });
    });
  }

  hide() {
    super.hide();
    window.pauseAllMedia();
  }

  show(focusElement) {
    this.focusElement = focusElement;
    this.setAttribute("open", "");
    document.body.addEventListener("click", this.onBodyClick);
    document.body.classList.add("overflow-hidden");
    trapFocus(this);
    this.setCorrectValues(focusElement);
  }

  setCorrectValues(focusElement) {
    const variantFields = this.modal.querySelectorAll(
      ".card-extended__variant"
    );

    const openerEl = focusElement.closest("modal-opener");
    const parentSection =
      document.querySelector(
        `section#${this.modal.id.replace(
          "AvaliabilityNotificationModal",
          "shopify-section"
        )}`
      ) || openerEl.closest("quick-add-modal");

    const fieldsets = Array.from(
      parentSection.querySelectorAll("variant-radios fieldset")
    );

    const optionsObj = fieldsets.reduce((acc, fieldset) => {
      const key = fieldset.dataset.optionName;
      if (!key) return null;
      const value = Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      )?.value;

      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {});

    variantFields.forEach((field) => {
      const openerOption = openerEl.dataset.option;
      if (field.dataset.option === openerOption) {
        field.querySelector(".card-extended__variant-value").textContent =
          openerEl.dataset.value;
      } else {
        field.querySelector(".card-extended__variant-value").textContent =
          optionsObj[field.dataset.option];
      }
    });

    const hiddenInput = this.modal.querySelector(
      ".product-popup-modal__form-wrapper input[type='hidden']#ContactForm-options"
    );
    const subscriptionForm = this.modal.querySelector(".subscription-form");
    if (!hiddenInput || !subscriptionForm) return;
    const productToSubscribe = hiddenInput.dataset.product;

    if (!productToSubscribe) return;

    const productOptions = Array.from(variantFields)
      .map((field) => {
        const option = field.dataset.option || "";
        const value =
          field.querySelector(".card-extended__variant-value")?.textContent ||
          "";
        return `${option}: ${value}`;
      })
      .join(", ");

    hiddenInput.value = productOptions;
    const infoToAdd = "ContactFormSubscribe-" + productToSubscribe;
    subscriptionForm.id = infoToAdd;
    subscriptionForm.action = "/contact#" + infoToAdd;

    const productMedia = this.modal.querySelector(".product__media") ?? null;
    const generateImgSrcset = (image, imageToShow, widths = []) => {
      const originalUrl = new URL(image["src"]);
      const originalPath = originalUrl.pathname;

      const newPath = originalPath.replace(
        /(?:products|files)\/[^/]+\.(jpg|png|webp)/i,
        imageToShow
      );
      originalUrl.pathname = `/${newPath.replace(/^\/+/, "")}`;

      return widths
        .filter((width) => width <= image.getAttribute("width"))
        .map((width) => {
          originalUrl.searchParams.set("width", width.toString());
          return `${originalUrl.href} ${width}w`;
        })
        .join(", ");
    };

    const createImgElement = (
      image,
      classes,
      sizes,
      productTitle,
      imageToShow
    ) => {
      const newImage = new Image(image["width"], image["height"]);
      newImage.className = classes;
      newImage.alt = image["alt"] || productTitle;
      newImage.sizes = sizes;
      const originalUrl = new URL(image["src"]);
      const originalPath = originalUrl?.pathname;

      const newPath = originalPath?.replace(
        /(?:products|files)\/[^/]+\.(jpg|png|webp)/i,
        imageToShow
      );
      originalUrl.pathname = `/${newPath.replace(/^\/+/, "")}`;

      newImage.src = originalUrl.href;
      newImage.srcset = generateImgSrcset(
        image,
        imageToShow,
        [
          360, 535, 720, 940, 1066, 1200, 1400, 1600, 1800, 2000, 2200, 2400,
          2600, 2800, 3000, 3200, 3400, 3600, 3800,
        ]
      );
      newImage.loading = "lazy";
      return newImage;
    };
    if (productMedia) {
      if (focusElement.dataset.unavailableVariantImg) {
        const imageToShow = focusElement.dataset.unavailableVariantImg;
        const primaryImage = productMedia.querySelector("img");

        if (primaryImage) {
          const newPrimaryImage = createImgElement(
            primaryImage,
            primaryImage.className,
            primaryImage.sizes,
            primaryImage.alt,
            imageToShow
          );

          if (newPrimaryImage.src !== primaryImage.src) {
            primaryImage.replaceWith(newPrimaryImage);
          }
        }
      } else {
        const imageToShow = parentSection.querySelector(
          ".product__media-item.active img"
        );

        const primaryImage = productMedia.querySelector("img");
        if (!imageToShow || !primaryImage) return;
        const newPrimaryImage = imageToShow.cloneNode(true);
        newPrimaryImage.className = primaryImage.className;
        newPrimaryImage.sizes = primaryImage.sizes;
        newPrimaryImage.alt = primaryImage.alt;
        if (imageToShow.src !== primaryImage.src) {
          primaryImage.replaceWith(newPrimaryImage);
        }
      }
    }
  }
}

customElements.define(
  "avaliability-notification-modal",
  AvaliabilityNotificationModal
);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      "click",
      this.loadContent.bind(this)
    );
    if (this.getAttribute("data-autoplay")) {
      this.loadContent();
    }
  }

  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      window.pauseAllMedia();

      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.getAttribute("data-autoplay")) {
              if (entry.target.nodeName === "VIDEO") {
                let playPromise = entry.target.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then((_) => {})
                    .catch((error) => {
                      console.error("Error playing video:", error);
                    });
                }
              } else if (entry.target.nodeName === "IFRAME") {
                if (entry.target.classList.contains("js-youtube")) {
                  entry.target.contentWindow.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    "*"
                  );
                } else {
                  entry.target.contentWindow.postMessage(
                    '{"method":"play"}',
                    "*"
                  );
                }
              }
            }
          } else {
            if (entry.target.nodeName === "VIDEO") {
              entry.target.pause();
            } else if (entry.target.nodeName === "IFRAME") {
              if (entry.target.classList.contains("js-youtube")) {
                entry.target.contentWindow.postMessage(
                  '{"event":"command","func":"pauseVideo","args":""}',
                  "*"
                );
              } else {
                entry.target.contentWindow.postMessage(
                  '{"method":"pause"}',
                  "*"
                );
              }
            }
          }
        });
      });

      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );

      if (
        deferredElement.nodeName === "VIDEO" ||
        deferredElement.nodeName === "IFRAME"
      ) {
        // force autoplay for Safari
        if (this.classList.contains("video-section__media")) {
          if (deferredElement.nodeName === "VIDEO") {
            let playPromise = deferredElement.play();
            if (playPromise !== undefined) {
              playPromise
                .then((_) => {})
                .catch((error) => {
                  console.error("Error playing video:", error);
                });
            }
          }

          videoObserver.observe(deferredElement);
        } else {
          if (deferredElement.nodeName === "VIDEO") {
            deferredElement.play();
          }
        }
      }

      if (
        this.closest(".swiper")?.swiper.slides[
          this.closest(".swiper").swiper.activeIndex
        ].querySelector("model-viewer")
      ) {
        const modelViewer =
          this.closest(".swiper").swiper.slides[
            this.closest(".swiper").swiper.activeIndex
          ].querySelector("model-viewer");

        if (
          !modelViewer.classList.contains("shopify-model-viewer-ui__disabled")
        ) {
          this.closest(".swiper").swiper.params.noSwiping = true;
          this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
        }
      }
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.isMiniCard = this.dataset.miniCard === "true" || false;

    if (
      this.querySelectorAll("variant-selects") &&
      this.querySelectorAll("variant-selects").length > 0
    ) {
      const hiddenInputs = this.querySelectorAll(
        ".dropdown-select .select-label input[type='hidden']"
      );

      if (hiddenInputs) {
        hiddenInputs.forEach((input) => {
          input.addEventListener("change", () => {
            this.onVariantChange();
          });
        });
      }
    } else {
      this.addEventListener("change", this.onVariantChange);
    }
  }

  onVariantChange(sync = true) {
    this.updateOptions();
    this.updateSelectedOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.updateVariantStatuses();

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      if (this.currentVariant?.featured_media && this.isMiniCard == false) {
        this.updateMedia(
          `${this.dataset.section}-${this.currentVariant.featured_media.id}`
        );
      }
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }

    if (sync) this.syncVariants();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));

    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }

  updateSelectedOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));

    fieldsets.forEach((fieldset) => {
      const selectedOptionElement = fieldset.querySelector(
        "input[type='radio']:checked"
      );
      const selectedOption = selectedOptionElement?.value ?? null;
      const selectedOptionText = fieldset.querySelector(
        ".product-form__group-name span"
      );

      if (selectedOptionText) {
        selectedOptionText.textContent = selectedOption;
      }
    });
  }

  updateMasterId() {
    if (this.variantData || this.querySelector('[type="application/json"]')) {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
    }
  }

  isHidden(elem) {
    const styles = window.getComputedStyle(elem);
    return styles.display === "none" || styles.visibility === "hidden";
  }

  updateMedia(mediaId) {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const currentSection = document.querySelector(
      `[data-section="main-${this.dataset.section}"]`
    );

    this.mediaList = currentSection.querySelector(".product__media-list");
    const miniMediaList = document.querySelector(".js-mini-media-list") || null;
    const activeMedia = this.mediaList.querySelector(
      `[data-media-id="${mediaId}"]`
    );

    const mediaItems = this.mediaList.querySelectorAll(
      ".product__media-item[data-media-id]"
    );

    mediaItems.forEach((element) => {
      element.classList.remove("active");
      element.classList.remove("after-active");
    });

    if (miniMediaList) {
      miniMediaList
        .querySelectorAll(".js-mini-media[data-media-id]")
        ?.forEach((element) => {
          element.classList.remove("active");
        });
    }

    if (activeMedia) {
      activeMedia.classList.add("active");

      const isFeaturedProductWithGrid =
        this.dataset.featuredProductGrid === "true" || false;
      const mediaToShow = +this.dataset.mediaToShow;

      if (isFeaturedProductWithGrid && mediaToShow === 2) {
        let afterActive = null;

        if (activeMedia === mediaItems[0]) {
          afterActive = mediaItems[1];
        } else {
          afterActive = mediaItems[0];
        }

        afterActive.classList.add("after-active");
      }

      if (miniMediaList) {
        const activeMiniMedia = miniMediaList.querySelector(
          `[data-media-id="${mediaId}"]`
        );

        if (activeMiniMedia) {
          activeMiniMedia.classList.add("active");
        }
      }
    }

    const swiperWrappers = document.querySelectorAll(".product__media-wrapper");

    if (swiperWrappers?.length > 0 && activeMedia) {
      swiperWrappers.forEach((elem) => {
        if (!this.isHidden(elem)) {
          // const newMedia = elem.querySelector(
          //   `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
          // );

          if (
            elem.querySelector(".js-media-list") &&
            elem.querySelector(".js-media-list").swiper
          ) {
            elem
              .querySelector(".js-media-list")
              .swiper.slideTo(
                elem
                  .querySelector(".js-media-list")
                  .swiper.slides.indexOf(activeMedia)
              );
          }
        }
      });
    }
  }

  updateURL() {
    if (
      !this.classList.contains("featured-product-radios") &&
      !this.classList.contains("featured-product-dropdown")
    ) {
      if (!this.currentVariant || this.dataset.updateUrl === "false") return;
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?variant=${this.currentVariant.id}`
      );
    }
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );

    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(":checked").value === variant.options[0]
    );
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];
      const previousOptionSelected =
        inputWrappers[index - 1].querySelector(":checked").value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter(
          (variant) =>
            variant.available &&
            variant.options[index - 1] === previousOptionSelected
        )
        .map((variantOption) => variantOption.options[index]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        if (input.tagName === "OPTION") {
          input.innerText = input.getAttribute("value");
        } else if (input.tagName === "INPUT") {
          input.classList.remove("disabled");
        }
      } else {
        if (input.tagName === "OPTION") {
          input.innerText =
            window.variantStrings.unavailable_with_option.replace(
              "[value]",
              input.getAttribute("value")
            );
        } else if (input.tagName === "INPUT") {
          input.classList.add("disabled");
        }
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${
        this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section
      }`
    )
      .then((response) => response.text())
      .then((responseText) => {
        // prevent unnecessary ui changes from abandoned selections
        if (this.currentVariant?.id !== requestedVariantId) return;

        const html = new DOMParser().parseFromString(responseText, "text/html");
        const destination = document.getElementById(
          `price-${this.dataset.section}`
        );
        const source = html.getElementById(
          `price-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const skuSource = html.getElementById(
          `Sku-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const skuDestination = document.getElementById(
          `Sku-${this.dataset.section}`
        );
        const inventorySource = html.getElementById(
          `Inventory-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const inventoryDestination = document.getElementById(
          `Inventory-${this.dataset.section}`
        );
        const colorNameSources = html.querySelectorAll(
          `[id^="ColorName-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }"]`
        );
        const colorNameDestinations = document.querySelectorAll(
          `[id^="ColorName-${
            this.dataset.originalSection && !this.closest("quick-add-modal")
              ? this.dataset.originalSection
              : this.dataset.section
          }"]`
        );

        if (source && destination) destination.innerHTML = source.innerHTML;
        if (inventorySource && inventoryDestination)
          inventoryDestination.innerHTML = inventorySource.innerHTML;
        if (skuSource && skuDestination) {
          skuDestination.innerHTML = skuSource.innerHTML;
          skuDestination.classList.toggle(
            "visibility-hidden",
            skuSource.classList.contains("visibility-hidden")
          );
        }
        if (colorNameSources?.length === colorNameDestinations?.length) {
          colorNameDestinations.forEach((colorNameDestination, index) => {
            colorNameDestination.innerHTML = colorNameSources[index].innerHTML;
          });
        }

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove("visibility-hidden");

        if (inventoryDestination)
          inventoryDestination.classList.toggle(
            "visibility-hidden",
            inventorySource.innerText === ""
          );

        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        );
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}`
    );

    if (!productForms) return;

    productForms.forEach((productForm) => {
      const addButton = productForm.querySelector('[name="add"]');

      const addButtonText = productForm.querySelector(
        '[name="add"] .button__label'
      );
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute("disabled", "disabled");
        if (text) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute("disabled");
        addButtonText.textContent = window?.variantStrings?.addToCart;
      }

      if (!modifyClass) return;
    });
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);

    if (!addButton) return;
    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (inventory) inventory.classList.add("visibility-hidden");
    if (sku) sku.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  syncVariants() {
    const parent = this.closest(".product");
    let variantElement, checkedOptions;

    if (this.isMiniCard) {
      variantElement =
        parent.querySelector(".product-parameters--main variant-selects") ||
        parent.querySelector(".product-parameters--main variant-radios");

      if (variantElement) {
        checkedOptions = this.querySelectorAll("fieldset input:checked");
        const fieldsets = variantElement.querySelectorAll("fieldset");

        fieldsets.forEach((fieldset, index) => {
          const checkedInput = checkedOptions[index];

          if (!checkedInput) return;
          const { value } = checkedInput;
          const targetInput = fieldset.querySelector(`input[value="${value}"]`);

          if (targetInput) {
            targetInput.checked = true;

            targetInput.dispatchEvent(new Event("change"));

            if (fieldset.querySelector(".dropdown-select .select-label")) {
              const selectedText = fieldset.querySelector(
                ".dropdown-select .select-label"
              );

              selectedText.querySelector("span").textContent = value;
              const hiddenInput = selectedText.querySelector(
                "input[type='hidden']"
              );

              if (hiddenInput && hiddenInput.dataset.colorSwatch) {
                hiddenInput.dataset.colorSwatch =
                  checkedInput.closest("li")?.dataset.color;
                selectedText.style.setProperty(
                  "--swatch-color",
                  checkedInput.closest("li")?.dataset.color
                );
              }
            }
          }
        });
        variantElement.onVariantChange(false);
      }
    } else {
      variantElement = parent.querySelector(
        ".product-parameters--mini-card variant-selects"
      );
      checkedOptions = this.querySelectorAll("fieldset input:checked");

      if (variantElement) {
        const fieldsets = variantElement.querySelectorAll("fieldset");

        fieldsets.forEach((fieldset, index) => {
          const checkedInput = checkedOptions[index];
          if (!checkedInput) return;
          const { value } = checkedInput;

          const targetInput = fieldset.querySelector(`input[value="${value}"]`);

          if (targetInput) {
            targetInput.checked = true;
            targetInput.dispatchEvent(new Event("change"));

            const selectedText = fieldset.querySelector(
              ".dropdown-select .select-label"
            );

            selectedText.querySelector("span").textContent = value;

            const hiddenInput = fieldset.querySelector(
              ".dropdown-select .select-label input[type='hidden']"
            );
            if (hiddenInput) {
              hiddenInput.value = value;
              if (hiddenInput.dataset.colorSwatch) {
                hiddenInput.dataset.colorSwatch =
                  checkedInput.closest("li")?.dataset.color ??
                  checkedInput.nextElementSibling?.dataset.colorSwatch;
                selectedText.style.setProperty(
                  "--swatch-color",
                  checkedInput.closest("li")?.dataset.color ??
                    checkedInput.nextElementSibling?.dataset.colorSwatch +
                      " no-repeat center/cover"
                );
              }
            }

            const mobileOptions = document.querySelectorAll(
              ".mini-card .mini-card__variant"
            );

            if (mobileOptions) {
              Array.from(mobileOptions).forEach((option) => {
                if (option.dataset.option === checkedInput.name) {
                  option.querySelector(
                    ".mini-card__variant-value"
                  ).textContent = value;
                }
              });
            }
          }
        });
        variantElement.onVariantChange(false);
      }
    }
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
        if (input.closest("fieldset")) return;
        input.disabled = false;
      } else {
        input.classList.add("disabled");
        if (input.closest("fieldset")) return;
        input.disabled = true;
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));

    this.options = fieldsets.map((fieldset) => {
      const values = Array.from(fieldset.querySelectorAll("input"))?.find(
        (radio) => radio.checked
      )?.value;

      return values;
    });
  }
}

customElements.define("variant-radios", VariantRadios);

class PasswordViewer {
  constructor() {
    const passwordField = document.querySelectorAll(".field--pass");

    passwordField.forEach((el) => {
      const input = el.querySelector("input");
      const btnWrapper = el.querySelector(".button-pass-visibility");
      const btnOpen = el.querySelector(".icon-eye-close");
      const btnClose = el.querySelector(".icon-eye");

      input.addEventListener("input", () => {
        input.value !== ""
          ? (btnWrapper.style.display = "block")
          : (btnWrapper.style.display = "none");
      });

      btnOpen.addEventListener("click", () => {
        input.type = "text";
        btnOpen.style.display = "none";
        btnClose.style.display = "block";
      });

      btnClose.addEventListener("click", () => {
        input.type = "password";
        btnOpen.style.display = "block";
        btnClose.style.display = "none";
      });
    });
  }
}

// -----------------------------------------------------------------------------
// COLOR SWATCHES START
function generateSrcset(image, widths = []) {
  const imageUrl = new URL(image["src"]);
  return widths
    .filter((width) => width <= image["width"])
    .map((width) => {
      imageUrl.searchParams.set("width", width.toString());
      return `${imageUrl.href} ${width}w`;
    })
    .join(", ");
}

function createImageElement(image, classes, sizes, productTitle) {
  const previewImage = image["preview_image"];
  const newImage = new Image(previewImage["width"], previewImage["height"]);
  newImage.className = classes;
  newImage.alt = image["alt"] || productTitle;
  newImage.sizes = sizes;
  newImage.src = previewImage["src"];
  newImage.srcset = generateSrcset(
    previewImage,
    [
      360, 535, 720, 940, 1066, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600,
      2800, 3000, 3200, 3400, 3600, 3800,
    ]
  );
  newImage.loading = "lazy";
  return newImage;
}

function setInputAvailability(wrapper) {
  const productVariants = JSON.parse(
    wrapper.querySelector('[type="application/json"]').textContent
  );

  const selectedColor = wrapper.querySelector(
    ".js-color-swatches input:checked"
  )?.value;
  const indexOption = wrapper
    .querySelector(".js-cart-option")
    ?.closest(".product-form__controls").dataset.index;
  const indexColor = wrapper
    .querySelector(".js-color-swatches")
    ?.closest(".product-form__controls").dataset.index;

  const selectedOptionOneVariants = productVariants.filter(
    (variant) =>
      wrapper.querySelector("input:checked").value ===
      variant[`option${indexColor}`]
  );

  if (indexOption) {
    const availableOptionInputsValue = selectedOptionOneVariants
      .filter(
        (variant) =>
          variant.available && variant[`option${indexColor}`] === selectedColor
      )
      .map((variantOption) => variantOption[`option${indexOption}`]);

    const options = wrapper.querySelectorAll(".js-cart-option input");
    options.forEach((input) => {
      if (availableOptionInputsValue.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
        input.disabled = false;
      } else {
        input.classList.add("disabled");
        input.disabled = true;
      }
    });
  }
}

function updateVariantId(form, wrapper) {
  const productVariants = JSON.parse(
    wrapper.querySelector('[type="application/json"]').textContent
  );
  let hiddenInput;
  if (form) hiddenInput = form.querySelector('input[name="id"]');

  const selectedOption = wrapper.querySelector(
    ".js-cart-option input:checked"
  )?.value;
  const selectedColor = wrapper.querySelector(
    ".js-color-swatches input:checked"
  )?.value;

  //!Color and other options may have different order in product
  const indexOption = wrapper
    .querySelector(".js-cart-option")
    ?.closest(".product-form__controls").dataset.index;
  const indexColor = wrapper
    .querySelector(".js-color-swatches")
    ?.closest(".product-form__controls").dataset.index;

  let matchedVariant;

  if (selectedOption && selectedColor) {
    matchedVariant = productVariants.find(
      (variant) =>
        variant[`option${indexOption}`] === selectedOption &&
        variant[`option${indexColor}`] === selectedColor
    );
  } else if (selectedOption) {
    matchedVariant = productVariants.find(
      (variant) => variant[`option${indexOption}`] === selectedOption
    );
  } else if (selectedColor) {
    matchedVariant = productVariants.find(
      (variant) => variant[`option${indexColor}`] === selectedColor
    );
  }

  if (matchedVariant) {
    if (hiddenInput) hiddenInput.value = matchedVariant.id;
    const link = wrapper.querySelector(".js-color-swatches-link");
    const currentHref = link.getAttribute("href");
    const url = new URL(currentHref, window.location.origin);
    url.searchParams.set("variant", matchedVariant.id);
    link.setAttribute("href", url.toString());

    if (wrapper.querySelector(".card__inventory")) {
      const product = window.productsData?.products?.find(
        (p) => p.id == wrapper.dataset.id
      );
      if (product) {
        const variant = product.variants.find(
          (v) => v.id === matchedVariant.id
        );
        if (variant) {
          const count = window.variantStrings.lastItems.replace(
            "[count]",
            variant.inventory_quantity
          );

          if (variant.inventory_quantity > 10) {
            wrapper.querySelector(".card__inventory").classList.add("hidden");
          } else {
            wrapper.querySelector(".card__inventory").innerText = count;
            wrapper
              .querySelector(".card__inventory")
              .classList.remove("hidden");
          }
        }
      }
    }

    return matchedVariant.id;
  }
}

function checkSwatches() {
  document.querySelectorAll(".js-color-swatches-wrapper").forEach((wrapper) => {
    //const form = wrapper.querySelector(".card__add-to-cart form");
    const form = wrapper.querySelector("product-form.card__add-to-cart");

    wrapper.querySelectorAll(".js-color-swatches input").forEach((input) => {
      input.addEventListener("click", (event) => {
        const primaryImage = wrapper.querySelector(".media--first");
        const secondaryImage = wrapper.querySelector(".media--second");
        const handleProduct = wrapper.dataset.product;

        if (event.currentTarget.checked) {
          if (wrapper.querySelector('.card__add-to-cart button[name="add"]')) {
            wrapper
              .querySelector('.card__add-to-cart button[name="add"]')
              .setAttribute("aria-disabled", false);
            if (
              wrapper.querySelector(
                '.card__add-to-cart button[name="add"] > span'
              )
            ) {
              wrapper
                .querySelector('.card__add-to-cart button[name="add"] > span')
                .classList.remove("hidden");
            }
            wrapper.querySelector('.card__add-to-cart input[name="id"]').value =
              event.currentTarget.dataset.variantId;
          }

          if (!wrapper.classList.contains("card-horizontal-wrapper"))
            setInputAvailability(wrapper);

          const currentColor = event.currentTarget.value;
          const currentVariantId = updateVariantId(form, wrapper);

          if (primaryImage) {
            fetch(`${window.Shopify.routes.root}products/${handleProduct}.js`)
              .then((response) => response.json())
              .then((product) => {
                const variant = product.variants.filter(
                  (item) =>
                    (currentVariantId &&
                      item.id == currentVariantId &&
                      item.featured_media != null &&
                      item.options.includes(currentColor)) ||
                    (!currentVariantId &&
                      item.featured_media != null &&
                      item.options.includes(currentColor))
                )[0];

                if (variant) {
                  const newPrimaryImage = createImageElement(
                    variant["featured_media"],
                    primaryImage.className,
                    primaryImage.sizes,
                    product.title
                  );

                  if (newPrimaryImage.src !== primaryImage.src) {
                    let flag = false;
                    if (secondaryImage) {
                      const secondaryImagePathname = new URL(secondaryImage.src)
                        .pathname;
                      const newPrimaryImagePathname = new URL(
                        newPrimaryImage.src
                      ).pathname;

                      if (secondaryImagePathname == newPrimaryImagePathname) {
                        primaryImage.remove();
                        secondaryImage.classList.remove("media--second");
                        secondaryImage.classList.add("media--first");
                        flag = true;
                      }
                    }
                    if (flag == false) {
                      primaryImage.animate(
                        { opacity: [1, 0] },
                        { duration: 200, easing: "ease-in", fill: "forwards" }
                      ).finished;
                      setTimeout(function () {
                        primaryImage.replaceWith(newPrimaryImage);
                        newPrimaryImage.animate(
                          { opacity: [0, 1] },
                          { duration: 200, easing: "ease-in" }
                        );
                        if (secondaryImage) {
                          secondaryImage.remove();
                        }
                      }, 200);
                    }
                  }
                }
              })
              .catch(() => {});
          }
        }
      });
    });

    const inputs = wrapper.querySelectorAll(".js-cart-option input");
    inputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        updateVariantId(form, wrapper);

        //Form submit
        //const productForm = form.closest("product-form");
        const fakeEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        form.onSubmitHandler(fakeEvent);
      });
    });

    const modalWithOptions = wrapper.querySelector(".js-cart-option");
    const optionsBtn = wrapper.querySelector(".card__link--add-to-cart_show");
    optionsBtn?.addEventListener("click", (event) => {
      if (!modalWithOptions) return;
      modalWithOptions.classList.add("active");
      optionsBtn.style.opacity = 0;
      const quickViewBtn = optionsBtn?.previousElementSibling;
      if (
        quickViewBtn &&
        quickViewBtn.classList.contains("card__quick-view_mobile")
      ) {
        quickViewBtn.style.opacity = 0;
      }
    });

    const onOutsideOptionsClick = (event) => {
      if (!modalWithOptions || !optionsBtn) return;
      if (
        !modalWithOptions.contains(event.target) &&
        !optionsBtn.contains(event.target)
      ) {
        if (modalWithOptions.classList.contains("active")) {
          modalWithOptions.classList.remove("active");
          optionsBtn.style.opacity = 1;
          const quickViewBtn = optionsBtn?.previousElementSibling;
          if (
            quickViewBtn &&
            quickViewBtn.classList.contains("card__quick-view_mobile")
          ) {
            quickViewBtn.style.opacity = 1;
          }
        }
      }
    };
    if (modalWithOptions && optionsBtn) {
      document.addEventListener("click", onOutsideOptionsClick);
    }
  });
}

// func reused in other places
function colorSwatches() {
  checkSwatches();

  document.addEventListener("shopify:section:load", function () {
    checkSwatches();
  });
}

(function () {
  colorSwatches();
})();

// COLOR SWATCHES END
// -----------------------------------------------------------------------------

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      if (this.querySelector(".product-recommendations__loading")) {
        this.querySelector(".product-recommendations__loading").classList.add(
          "loading"
        );
        this.querySelector(".product-recommendations__loading").style.display =
          "flex";
      }

      this.complementarySlider = null;

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelectorAll(
            "product-recommendations"
          );

          if (recommendations) {
            recommendations.forEach((segment) => {
              if (segment.innerHTML.trim().length) {
                const contentType = segment.dataset.intent;
                if (this.dataset.intent === contentType) {
                  this.innerHTML = segment.innerHTML;
                }
              }
            });
          }

          /* Color swatches */
          checkSwatches();

          const addClasses = (slider) => {
            const sliderWrapper = slider.querySelector(
              ".product-recommendations__list"
            );
            const slides = slider.querySelectorAll(
              ".product-recommendations__item"
            );

            slider.classList.add("swiper");
            if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");

            if (slides.length > 1) {
              slides.forEach((slide) => {
                slide.classList.add("swiper-slide");
              });
            }
          };

          const removeClasses = (slider) => {
            const sliderWrapper = slider.querySelector(
              ".product-recommendations__list"
            );
            const slides = slider.querySelectorAll(
              ".product-recommendations__item"
            );

            slider.classList.remove("swiper");
            if (sliderWrapper) sliderWrapper.classList.remove("swiper-wrapper");

            if (slides.length > 0) {
              slides.forEach((slide) => {
                slide.removeAttribute("style");
                slide.classList.remove("swiper-slide");
              });
            }
          };

          const initSlider = (slider) => {
            if (!slider) return;
            const sliderTemplate = slider.dataset.template;
            const sliderLayout = slider.dataset.layout;
            const navigationWrapper = this.querySelector(
              '.js-recommendation-nav[data-nav-id="' + sliderTemplate + '"]'
            );
            const mobileColumns = Number(slider.dataset.mobileColumn || 1);

            const blockBreakpoints = {
              576: {
                slidesPerView: 2,
              },
              750: {
                slidesPerView: 3,
              },
              990: {
                slidesPerView: 2,
              },
              1440: {
                slidesPerView: 3,
              },
            };

            const sectionBreakpoints = {
              576: {
                slidesPerView: 2,
              },
              750: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
              1440: {
                slidesPerView: 5,
              },
              1600: {
                slidesPerView: 6,
              },
            };

            const breakpointsObj =
              sliderLayout === "block" ? blockBreakpoints : sectionBreakpoints;
            const sliderSettings = {
              slidesPerView: mobileColumns,
              spaceBetween: 8,
              speed: 800,
              allowTouchMove: true,
              mousewheel: {
                forceToAxis: true,
              },
              navigation: {
                nextEl:
                  navigationWrapper?.querySelector(".swiper-button-next") ??
                  null,
                prevEl:
                  navigationWrapper?.querySelector(".swiper-button-prev") ??
                  null,
                disabledClass: "swiper-button-disabled",
              },
              breakpoints: {
                ...breakpointsObj,
              },
            };

            addClasses(slider);
            new Swiper(slider, sliderSettings);
          };

          const destroySlider = (slider) => {
            if (!slider) return;

            removeClasses(slider);
            slider.destroy(true, true);
          };

          const initComplementarySlider = () => {
            const slider = this.querySelector(".js-complementary-swiper");

            if (!slider) return;

            const sliderSettings = {
              slidesPerView: 1,
              spaceBetween: 4,
              speed: 800,
              allowTouchMove: true,
              mousewheel: {
                forceToAxis: true,
              },
              navigation: {
                nextEl:
                  document.querySelector(
                    ".product__complimentary-slider-nav-next"
                  ) ?? null,
                prevEl:
                  document.querySelector(
                    ".product__complimentary-slider-nav-prev"
                  ) ?? null,
                disabledClass: "swiper-button-disabled",
              },
            };

            if (slider.swiper) {
              slider.swiper.destroy(true, true);
            }

            new Swiper(slider, sliderSettings);
          };

          const initSection = () => {
            const sliders = this.querySelectorAll(".js-recommendation-swiper");

            if (!sliders) return;

            sliders.forEach((slider) => {
              if (slider?.swiper) {
                destroySlider(slider);
              }
              initSlider(slider);
            });
          };

          initComplementarySlider();
          initSection();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          if (this.querySelector(".product-recommendations__loading")) {
            this.querySelector(
              ".product-recommendations__loading"
            ).classList.remove("loading");
            this.querySelector(".product-recommendations__loading").remove();
          }
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 400px 0px",
    }).observe(this);
  }
}

customElements.define("product-recommendations", ProductRecommendations);
function formatMoney(cents, format = "") {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || theme.moneyFormat;

  function formatWithDelimiters(
    number,
    precision = 2,
    thousands = ",",
    decimal = "."
  ) {
    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split(".");
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    );
    const centsAmount = parts[1] ? decimal + parts[1] : "";

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

class LocalizationFormBasic extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector(
        'input[name="locale_code"], input[name="country_code"]'
      ),
      form: this.querySelector("form"),
    };

    this.initializeClickEvents();
  }

  initializeClickEvents() {
    this.querySelectorAll("a").forEach((item) =>
      item.addEventListener("click", this.onItemClick.bind(this))
    );
  }

  onItemClick(event) {
    event.preventDefault();

    const input = this.elements?.input;

    if (input) {
      input.value = event.currentTarget.dataset.value;
      this.elements.form?.submit();
    }
  }
}

class HeaderLocalizationForm extends LocalizationFormBasic {
  constructor() {
    super();
  }
}

if (!customElements.get("header-localization-form")) {
  customElements.define("header-localization-form", HeaderLocalizationForm);
}

class FooterLocalizationForm extends LocalizationFormBasic {
  constructor() {
    super();

    Object.assign(this.elements, {
      button: this.querySelector("button"),
      panel: this.querySelector("ul"),
    });

    this.bindEventHandlers();
  }

  bindEventHandlers() {
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.onEscapePress = this.onEscapePress.bind(this);

    if (this.elements.button) {
      this.elements.button.addEventListener(
        "click",
        this.togglePanel.bind(this)
      );
    }

    this.addEventListener("keydown", this.onEscapePress);

    this.initializeClickEvents();
  }

  connectedCallback() {
    document.addEventListener("click", this.handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick);
  }

  handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.hidePanel();
    }
  }

  updatePanelState(isVisible) {
    const { button, panel } = this.elements;

    if (button && panel) {
      button.setAttribute("aria-expanded", isVisible.toString());

      if (isVisible) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", true);
      }
    }
  }

  hidePanel() {
    this.updatePanelState(false);
  }

  showPanel() {
    this.updatePanelState(true);
  }

  togglePanel() {
    const isExpanded =
      this.elements.button.getAttribute("aria-expanded") === "true";

    this.updatePanelState(!isExpanded);
  }

  onEscapePress(event) {
    if (event.key === "Escape") {
      this.hidePanel();
    }
  }

  onItemClick(event) {
    super.onItemClick(event);
    this.hidePanel();
  }
}

if (!customElements.get("footer-localization-form")) {
  customElements.define("footer-localization-form", FooterLocalizationForm);
}

// SLIDE UP, SLIDE DOWN
// -----------------------------------------------------------------------------
function slideUp(toggleEl, contentEl, duration = 300, index = 0) {
  // Get the current height of the element
  const height = contentEl.clientHeight;
  // Set animation styles
  contentEl.style.transitionProperty = "height, margin, padding";
  contentEl.style.transitionDuration = duration + "ms";
  // contentEl.style.transitionDelay = duration * index + "ms";
  contentEl.style.overflow = "hidden";

  // Set initial values
  contentEl.style.height = height + "px";
  contentEl.style.padding = "0";
  contentEl.style.margin = "0";

  // Delay to start animation
  setTimeout(function () {
    // Set the values ​​for hiding the element
    contentEl.style.height = "0";
    contentEl.style.padding = "0";
    contentEl.style.margin = "0";
  }, 10);

  // Delay for animation to complete
  setTimeout(function () {
    // Remove installed styles after animation
    toggleEl.classList.remove("active");
    contentEl.classList.remove("active");
    contentEl.style.removeProperty("height");
    contentEl.style.removeProperty("padding");
    contentEl.style.removeProperty("margin");
    contentEl.style.removeProperty("overflow");
    contentEl.style.removeProperty("transition-duration");
    // contentEl.style.removeProperty("transition-delay");
    contentEl.style.removeProperty("transition-property");
  }, duration);
}

function slideDown(toggleEl, contentEl, duration = 300) {
  toggleEl.classList.add("active");
  contentEl.classList.add("active");
  contentEl.style.overflow = "hidden";
  contentEl.style.height = "0";

  const height = contentEl.scrollHeight;

  setTimeout(function () {
    contentEl.style.height = height + "px";
  }, 10);

  setTimeout(function () {
    contentEl.style.removeProperty("overflow");
    contentEl.style.removeProperty("height");
  }, duration);
}

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// PROMOCODE COPY START
(function () {
  //Fix for Shopify customizer
  function fallbackCopyTextToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      return successful;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function copyCode(e, copyButton) {
    const promocode = copyButton.dataset.code;

    const handleCopy = (btn, success) => {
      if (success) {
        btn.classList.add("copied");
        setTimeout(() => {
          btn.classList.remove("copied");
        }, 1000);
      } else {
        btn.classList.add("notCopied");
        setTimeout(() => {
          btn.classList.remove("notCopied");
        }, 1000);
      }
    };

    if (window.Shopify && window.Shopify.designMode) {
      const success = fallbackCopyTextToClipboard(promocode);
      handleCopy(copyButton, success);
    } else {
      navigator.clipboard.writeText(promocode).then(
        () => {
          handleCopy(copyButton, true);
        },
        () => {
          handleCopy(copyButton, false);
        }
      );
    }
  }

  const copyButtons = document.querySelectorAll(".promocode-button-copy");

  if (copyButtons.length) {
    for (const copyButton of copyButtons) {
      copyButton.addEventListener("click", (e) => copyCode(e, copyButton));
    }
  }

  document.addEventListener("shopify:section:load", function (event) {
    const copyButtons = document.querySelectorAll(".promocode-button-copy");

    if (copyButtons.length) {
      for (const copyButton of copyButtons) {
        copyButton.addEventListener("click", (e) => copyCode(e, copyButton));
      }
    }
  });
})();
// PROMOCODE COPY END
// -----------------------------------------------------------------------------

// Dropdown variants select
// -----------------------------------------------------------------------------

const selectDropDown = (context = document) => {
  const dropdownElements = context.querySelectorAll(
    ".product-form__controls--dropdown"
  );

  const closeDropdowns = (exceptElement = null) => {
    dropdownElements.forEach((element) => {
      const elItem = element.querySelector(".dropdown-select .select-wrapper");
      if (elItem !== exceptElement) {
        elItem.classList.remove("active");
      }
    });
  };

  dropdownElements.forEach((element) => {
    const elListItem = element.querySelectorAll(".dropdown-select ul li");
    const elItem = element.querySelector(".dropdown-select .select-wrapper");
    const selectedText = element.querySelector(
      ".dropdown-select .select-label"
    );

    const selectElem = element.querySelector(".select.dropdown-select");

    const hiddenInput = element.querySelector(
      ".dropdown-select .select-label input[type='hidden']"
    );

    if (!hiddenInput) return;

    selectedText.addEventListener("click", function (e) {
      e.stopPropagation();

      const isActive = elItem.classList.contains("active");
      closeDropdowns(isActive ? null : elItem);
      elItem.classList.toggle("active", !isActive);
    });

    selectElem.addEventListener("keyup", function (e) {
      if (e.code && e.code.toUpperCase() === "ENTER") {
        e.stopPropagation();
        const isActive = elItem.classList.contains("active");
        closeDropdowns(isActive ? null : elItem);
        elItem.classList.toggle("active", !isActive);
      }
    });

    selectedText.addEventListener("dblclick", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    elItem.addEventListener("click", (e) => e.stopPropagation());
    const onToggleLiItem = (e) => {
      const closestLi = e.target.closest("li");
      const childInput = closestLi.querySelector("input");
      if (
        childInput.classList.contains("disabled") ||
        !selectedText.querySelector("span")
      ) {
        e.preventDefault();
        return;
      }

      childInput.checked = true;
      Array.from(elListItem)
        .filter((li) => li !== closestLi)
        .forEach((li) => {
          const input = li.querySelector("input");
          if (input) {
            input.checked = false;
          }
        });

      selectedText.querySelector("span").textContent = closestLi.dataset.value;

      hiddenInput.value = closestLi.dataset.value;
      hiddenInput.dataset.colorSwatch = closestLi.dataset.color;
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));

      selectedText.style.setProperty("--swatch-color", closestLi.dataset.color);
      elItem.classList.remove("active");
      document.activeElement.blur();
    };
    elListItem.forEach((li) => {
      li.addEventListener("click", function (e) {
        onToggleLiItem(e);
      });

      li.addEventListener("keydown", function (e) {
        if (e.code && e.code.toUpperCase() === "ENTER") {
          onToggleLiItem(e);
        }
      });
    });
    elItem.addEventListener("keyup", function (e) {
      const isOpen = elItem.classList.contains("active");
      const currentFocused = elItem.querySelector("li:focus");
      const items = Array.from(elListItem);
      const eventCode = e.code.toUpperCase();
      switch (eventCode) {
        case "ENTER":
          e.preventDefault();
          if (!isOpen) {
            elItem.classList.add("active");
            elItem.setAttribute("aria-expanded", "true");
            items[0].focus();
          } else if (currentFocused) {
            currentFocused.click();
          }
          break;

        case "ARROWDOWN":
          e.preventDefault();
          if (!isOpen) {
            elItem.classList.add("active");
            elItem.setAttribute("aria-expanded", "true");
            items[0].focus();
          } else {
            const next = items[items.indexOf(currentFocused) + 1] || items[0];
            next.focus();
          }
          break;

        case "ARROWUP":
          e.preventDefault();
          if (isOpen) {
            const prev =
              items[items.indexOf(currentFocused) - 1] ||
              items[items.length - 1];
            prev.focus();
          }
          break;

        case "ESCAPE":
          e.preventDefault();
          elItem.classList.remove("active");
          elItem.setAttribute("aria-expanded", "false");
          elItem.focus();
          break;
      }
    });

    context.addEventListener("click", () => {
      closeDropdowns();
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  selectDropDown();
  document.addEventListener("shopify:section:load", function (e) {
    selectDropDown();
  });
});

// Dropdown variants select end
// -----------------------------------------------------------------------------

// ANIMATION START
// -----------------------------------------------------------------------------
function addAnimation() {
  document.querySelectorAll(".section-animation").forEach((section) => {
    const delayStep = 100;
    const items = section.querySelectorAll(
      ".column-animation, .banner-animation"
    );
    let observer = null;

    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * delayStep}ms`;
    });

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 750;
      if (isDesktop) {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry, index) => {
              const target = entry.target;

              if (
                entry.isIntersecting &&
                !target.classList.contains("animate")
              ) {
                target.style.transitionDelay = `${index * delayStep}ms`;
                target.classList.add("animate");
                obs.unobserve(entry.target);

                if (target.classList.contains("swiper-slide")) {
                  let next = target.nextElementSibling;
                  while (next && next.classList.contains("swiper-slide")) {
                    next.classList.add("animate");
                    obs.unobserve(next);
                    next = next.nextElementSibling;
                  }
                }
              }
            });
            //});
          },
          { threshold: 0.1 }
        );

        items.forEach((item) => observer.observe(item));
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addAnimation();
});

document.addEventListener("shopify:section:load", function () {
  addAnimation();
});

// ANIMATION END
// -----------------------------------------------------------------------------
