(function () {
  const initDropdown = () => {
    const dropdowns = document.querySelectorAll(".dropdown-opener");
    if (!dropdowns.length) return;

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdownsExcept(dropdown);

        dropdown.classList.toggle("active");
      });
    });

    const closeAllDropdownsExcept = (exception = null) => {
      dropdowns.forEach((dropdown) => {
        if (dropdown !== exception) {
          dropdown.classList.remove("active");
        }
      });
    };

    document.addEventListener("click", (event) => {
      if (
        !event.target.closest(".dropdown-opener") &&
        !event.target.closest(".share-buttons__list") &&
        !event.target.closest(".copy")
      ) {
        closeAllDropdownsExcept();
      } else if (event.target.closest(".copy")) {
        setTimeout(() => {
          closeAllDropdownsExcept();
        }, 800);
      }
    });
  };

  // Tabs scrolling shadow function

  const onScrollTabs = (box) => {
    if (!box) return;
    const tabsWrapper = box.querySelector(".description-tags-wrapper");
    const tabsTrack = box.querySelector(".description-tags");

    if (!tabsWrapper || !tabsTrack) return;
    const leftShadow = tabsWrapper.querySelector(".scroll-shadow--left");
    const rightShadow = tabsWrapper.querySelector(".scroll-shadow--right");

    if (!leftShadow || !rightShadow) return;

    if (tabsTrack.scrollWidth > tabsTrack.offsetWidth) {
      rightShadow.classList.add("show");
    }
    tabsTrack.addEventListener("scroll", () => {
      if (tabsTrack.scrollLeft < 25) {
        leftShadow.classList.remove("show");
      } else {
        leftShadow.classList.add("show");
      }

      if (
        tabsTrack.scrollWidth - (tabsTrack.scrollLeft + tabsTrack.offsetWidth) >
        25
      ) {
        rightShadow.classList.add("show");
      } else {
        rightShadow.classList.remove("show");
      }
    });
  };

  // Description tabs
  const initDescriptionTabs = () => {
    const section = document.querySelector(".product-section");

    if (!section) return;

    const box = section.querySelector(".product__description-wrapper");
    if (!box) return;

    const layout = box.dataset.layout;
    if (layout !== "tabs") return;

    const tabs = box.querySelectorAll(".description-tags__tag");
    const blocks = box.querySelectorAll(".product__description-block");
    if (!tabs || !blocks) return;

    const reviewWidgets = section.querySelectorAll(".jdgm-widget");
    const ratingButton = section.querySelector(".rating__button");

    const onToggleTabs = (e, tab) => {
      tabs.forEach((el) => {
        el.classList.remove("active");
      });
      const tabCode = tab.dataset.tag;
      const closestTab = e.target.closest(".description-tags__tag");
      closestTab.classList.add("active");
      blocks.forEach((el) => {
        el.classList.remove("active");
      });
      reviewWidgets?.forEach((el) => {
        el.style.display = "none";
      });

      if (closestTab.dataset.tag !== "review") {
        box
          .querySelector(`.product__description-block[data-info="${tabCode}"]`)
          ?.classList.add("active");
      } else {
        reviewWidgets?.forEach((el) => {
          el.style.display = "block";
        });
      }
    };
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        onToggleTabs(e, tab);
      });
      tab.addEventListener("keyup", (e) => {
        if (e.code && e.code.toUpperCase() === "ENTER") {
          onToggleTabs(e, tab);
        }
      });
    });

    if (reviewWidgets && reviewWidgets.length > 0 && ratingButton) {
      const onToggleRatingButton = () => {
        const heightToScroll = box.offsetTop;
        const reviewTab = box.querySelector(
          `.description-tags__tag[data-tag="review"]`
        );

        window.scrollTo({
          top: heightToScroll,
          behavior: "smooth",
        });

        if (reviewTab.classList.contains("active")) {
          return;
        } else {
          tabs.forEach((el) => {
            el.classList.remove("active");
          });
          blocks.forEach((el) => {
            el.classList.remove("active");
          });

          reviewTab.classList.add("active");
          reviewWidgets?.forEach((el) => {
            el.style.display = "block";
          });
        }
      };
      ratingButton.addEventListener("click", () => onToggleRatingButton());
      ratingButton.addEventListener("keyup", (e) => {
        if (e.code && e.code.toUpperCase() === "ENTER") {
          onToggleRatingButton();
        }
      });
    }

    // Init tabs scrolling shadow

    onScrollTabs(box);
  };

  // Description accordeon
  const initProductAccordion = () => {
    const section = document.querySelector(".product-section");
    if (!section) return;
    const box = section.querySelector(".product__description-wrapper");
    if (!box) return;

    const layout = box.dataset.layout;
    if (layout !== "dropdown") return;

    const toggles = document.querySelectorAll(".dropdown-heading");

    if (!toggles) return;

    const reviewsToggle = box.querySelector(
      ".dropdown-heading[data-tag='review']"
    );
    const reviews = section.querySelectorAll(
      ".shopify-block.shopify-app-block"
    );

    reviews?.forEach((review) => {
      const reviewId = review.id;
      if (!reviewId.indexOf("judge_me_reviews")) {
        reviews.splice(reviews.indexOf(review), 1);
      }
    });

    reviews?.forEach((review) => {
      const reviewParent = review.parentElement;
      reviewParent.classList.add("dropdown-under-review");
    });

    if (reviews?.length > 0) {
      document.addEventListener("shopify:section:load", () => {
        if (reviewsToggle && reviewsToggle.classList.contains("active")) {
          reviews.forEach((review) => {
            slideDown(reviewsToggle, review, 300); // func in global.js
          });
        }
      });
    }

    const ratingButton = section.querySelector(".rating__button");
    const onHandleToggles = (event, toggle) => {
      event.preventDefault();
      toggles.forEach((el) => {
        if (!el.classList.contains("active")) return;
        const closeDescription = el.nextElementSibling?.classList.contains(
          "dropdown-under"
        )
          ? el.nextElementSibling
          : null;

        if (el.getAttribute("data-tag") === "review") {
          reviews?.forEach((review, i) => {
            slideUp(el, review, 300, i); // func in global.js
          });
        } else {
          slideUp(el, closeDescription, 300); // func in global.js
        }
      });

      const description = toggle.nextElementSibling?.classList.contains(
        "dropdown-under"
      )
        ? toggle.nextElementSibling
        : null;

      if (description && toggle.getAttribute("data-tag") !== "review") {
        if (toggle.classList.contains("active")) {
          slideUp(toggle, description, 300); // func in global.js
        } else {
          slideDown(toggle, description, 300); // func in global.js
        }
      } else if (toggle.getAttribute("data-tag") === "review") {
        if (!toggle.classList.contains("active")) {
          reviews?.forEach((review) => {
            slideDown(toggle, review, 300); // func in global.js
          });
        } else {
          reviews?.forEach((review, i) => {
            slideUp(toggle, review, 300, i); // func in global.js
          });
        }
      }
    };
    toggles.forEach((toggle) => {
      if (toggle) {
        toggle.removeEventListener("click", onHandleToggles);
        toggle.addEventListener("click", (event) => {
          onHandleToggles(event, toggle);
        });
        toggle.addEventListener("keyup", (event) => {
          if (event.code && event.code.toUpperCase() === "ENTER") {
            onHandleToggles(event, toggle);
          }
        });
      }
    });

    if (reviews && reviews.length > 0 && ratingButton) {
      const onToggleRatingBtn = () => {
        const reviewToggle = box.querySelector(
          `.dropdown-heading[data-tag="review"]`
        );

        box.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        if (reviewToggle.classList.contains("active")) {
          return;
        } else {
          const activeToggle = box.querySelector(".dropdown-heading.active");

          const description = activeToggle.nextElementSibling;

          slideUp(activeToggle, description, 300);

          reviews.forEach((review) => {
            slideDown(reviewToggle, review, 300); // func in global.js
          });
        }
      };

      ratingButton.addEventListener("click", () => onToggleRatingBtn());
      ratingButton.addEventListener("keyup", (event) => {
        if (event.code && event.code.toUpperCase() === "ENTER") {
          onToggleRatingBtn();
        }
      });
    }
  };

  // Similar products slider

  const initSimilarProductsSlider = (section) => {
    if (!section) return;
    const slider = section.querySelector(".js-similar-swiper");
    if (!slider) return;
    const mobileColumns = Number(slider.dataset.mobileColumn || 1);

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
          section.querySelector(".js-similar-nav .swiper-button-next") ?? null,
        prevEl:
          section.querySelector(".js-similar-nav .swiper-button-prev") ?? null,
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
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
      },
    };

    if (slider.swiper) {
      slider.swiper.destroy(true, true);
    }

    new Swiper(slider, sliderSettings);
  };

  // Product markers

  const initProductMarkers = (section) => {
    if (!section) {
      return;
    }

    const allMarkers = section.querySelectorAll(".product-markers__item");
    const edgePadding = 72;
    const extraOffset = 5;

    const calcNewCoord = (marker) => {
      const card = marker.closest(".product-markers__product");
      const cardInner = marker.querySelector(".product-markers__item-inner");

      const cardRect = card.getBoundingClientRect();
      const cardInnerRect = cardInner.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const leftMarker = markerRect.left - cardRect.left;

      if (leftMarker < edgePadding) {
        cardInner.style.left = -1 * leftMarker + extraOffset + "px";
      } else if (
        leftMarker - edgePadding + cardInnerRect.width >
        cardRect.width
      ) {
        cardInner.style.left =
          -1 *
            (cardInnerRect.width -
              (cardRect.width - leftMarker + edgePadding) +
              edgePadding +
              extraOffset) +
          "px";
      } else {
        cardInner.style.left = "";
      }
    };

    allMarkers.forEach((marker) => {
      calcNewCoord(marker);

      if (marker.dataset.handlerAdded === "true") return;

      marker.dataset.handlerAdded = "true";

      marker.addEventListener("focusin", () => {
        marker.classList.add("active");
      });

      marker.addEventListener("focusout", (e) => {
        if (marker.contains(e.relatedTarget)) return;

        marker.classList.remove("active");
      });

      marker.addEventListener("keydown", (e) => {
        if (e.key === "Escape") marker.classList.remove("active");
      });
    });

    document.addEventListener("pointerdown", (e) => {
      const clickMarker = e.target.closest(".product-markers__item");

      allMarkers.forEach((marker) => {
        if (marker !== clickMarker) {
          marker.classList.remove("active");
        }
      });
    });

    const sectionResizeObserver = new ResizeObserver(() => {
      allMarkers.forEach((marker) => {
        calcNewCoord(marker);
      });
    });

    sectionResizeObserver.observe(section);
  };

  // Sticky miniblocks

  const initStickyMiniblocks = (section) => {
    if (!section) return;

    const widgetsWrapper = section.querySelector(".mini-widgets");
    if (!widgetsWrapper) return;

    const widgetsPosition = widgetsWrapper.dataset.position;
    if (!widgetsPosition) return;

    const footerBottom = document.querySelector(
      ".shopify-section-group-footer-group .footer-bottom"
    );
    const buyButtons = section.querySelector(
      ".product__buy-buttons > product-form"
    );

    if (!buyButtons) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.01,
    };

    const isElementBelowScroll = (element) => {
      return element ? element.getBoundingClientRect().top > 0 : false;
    };

    const toggleWidgetsPanel = (isVisible) => {
      if (isVisible || isElementBelowScroll(buyButtons)) {
        widgetsWrapper.classList.remove("active");
      } else {
        widgetsWrapper.classList.add("active");
      }
    };

    const handleIntersect = (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);

      toggleWidgetsPanel(isVisible);
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (buyButtons) observer.observe(buyButtons);
    if (footerBottom) observer.observe(footerBottom);
  };

  initDropdown();
  initStickyMiniblocks(document.currentScript.parentElement);
  initDescriptionTabs();
  initProductMarkers(document.currentScript.parentElement);
  initSimilarProductsSlider(document.currentScript.parentElement);
  initProductAccordion();

  document.addEventListener("shopify:section:load", (e) => {
    initDropdown();

    initStickyMiniblocks(e.target);
    initDescriptionTabs();
    initProductMarkers(e.target);
    initSimilarProductsSlider(e.target);
  });

  // To prevent rerender bug inside the theme editor
  if (!window.Shopify.designMode) {
    document.addEventListener("shopify:section:load", function () {
      initProductAccordion();
    });
  }
})();
