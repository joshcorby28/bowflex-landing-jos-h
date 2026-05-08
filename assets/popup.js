"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var adpPopup = {};

  (function () {
    var $this;

    adpPopup = {
      sPrevious: window.scrollY,
      sDirection: "down",

      /*
       * Initialize
       */
      init: function (e) {
        $this = adpPopup;

        $this.popupInit(e);

        // Init events.
        $this.events(e);
      },

      /*
       * Events
       */
      events: function (e) {
        // Custom Events
        document.addEventListener("click", function (event) {
          if (
            event.target.matches(".popup-close") ||
            event.target.closest(".popup-close")
          ) {
            $this.closePopup(event);
          }
          if (
            event.target.matches(".popup-accept") ||
            event.target.closest(".popup-accept")
          ) {
            $this.acceptPopup(event);
            $this.closePopup(event);
          }
          if (
            event.target.matches(".age-verification__popup-close") ||
            event.target.closest(".age-verification__popup-close")
          ) {
            $this.agePopup(event);
            $this.closePopup(event);
          }
          if (
            event.target.matches(".age-verification__button-no") ||
            event.target.closest(".age-verification__button-no")
          ) {
            $this.ageDeclined(event);
          }
        });

        // Checking this will cause popup to close when user presses key.
        document.addEventListener("keyup", function (event) {
          // Press ESC to Close.
          if (event.key === "Escape") {
            document
              .querySelectorAll('.popup-open[data-esc-close="true"]')
              .forEach(function (popup) {
                $this.closePopup(popup);
              });
          }

          // Press F4 to Close.
          if (event.key === "F4") {
            document
              .querySelectorAll('.popup-open[data-f4-close="true"]')
              .forEach(function (popup) {
                $this.closePopup(popup);
              });
          }
        });

        // Checking this will cause popup to close when user clicks on overlay.
        document.querySelectorAll(".popup-overlay").forEach((element) => {
          element.addEventListener("click", (event) => {
            if (
              element.previousElementSibling.matches(
                '.popup-open[data-overlay-close="true"]'
              )
            ) {
              $this.closePopup(element.previousElementSibling);
            }
          });
        });
      },

      /*
       * Init popup elements
       */
      popupInit: function (e) {
        // Set scroll direction.
        document.addEventListener("scroll", function () {
          let scrollCurrent = window.scrollY;
          if (scrollCurrent > $this.sPrevious) {
            $this.sDirection = "down";
          } else {
            $this.sDirection = "up";
          }
          $this.sPrevious = scrollCurrent;
        });

        // Open popup
        document.querySelectorAll(".popup").forEach(function (popup) {
          // Manual Launch.
          if ("manual" === popup.getAttribute("data-open-trigger")) {
            let selector = popup.getAttribute("data-open-manual-selector");
            if (selector) {
              const onTriggerClick = (event) => {
                event.preventDefault();
                if (
                  event.target.closest(".popup-close") ||
                  event.target.closest(".popup-overlay") ||
                  event.target.closest(".popup-button")
                ) {
                  popup.classList.remove("popup-already-opened");
                  $this.openPopup(popup);
                  if (event.target.classList.contains("popup")) {
                    $this.closePopup(selector);
                  }
                }
              };

              const triggerInteraction = (triggerElement) => {
                if (!triggerElement) return;
                triggerElement.addEventListener("click", onTriggerClick);

                const isClickableOverlay =
                  triggerElement.getAttribute("data-overlay-close") === "true";
                const overlay = triggerElement.nextElementSibling;
                if (
                  isClickableOverlay &&
                  overlay &&
                  overlay.classList.contains("popup-overlay")
                ) {
                  overlay.addEventListener("click", onTriggerClick);
                }
              };

              let triggerEl;

              if (selector.charAt(0) == "#") {
                triggerEl = document.getElementById(selector.slice(1));
              } else {
                triggerEl = document.querySelector(selector);
              }

              triggerInteraction(triggerEl);
            }
          }
          // Checks whether a popup should be displayed or not.
          if (
            !$this.isAllowPopup(popup) &&
            !popup.classList.contains("age-verification")
          ) {
            return;
          }
          $this.openTriggerPopup(popup);
        });
      },

      /*
       * Trigger open popup
       */
      openTriggerPopup: function (popup) {
        const trigger = popup.getAttribute("data-open-trigger");
        // Age Verification.
        if (trigger === "none") {
          let ageVerification = $this.getCookie(
            "popup-age-" + popup.getAttribute("data-id") || 0
          );
          if (!ageVerification) $this.openPopup(popup);
        }
        // Time Delay.
        if (trigger === "delay") {
          setTimeout(function () {
            $this.openPopup(popup);
          }, parseInt(popup.getAttribute("data-open-delay-number")) * 1000);
        }
        // Exit Intent.
        if (trigger === "exit") {
          var showExit = true;
          document.addEventListener("mousemove", function (event) {
            var scroll =
              window.pageYOffset || document.documentElement.scrollTop;
            if (event.pageY - scroll < 7 && showExit) {
              $this.openPopup(popup);
              showExit = false;
            }
          });
        }
        // Scroll Position.
        if (trigger === "scroll") {
          const pointScrollType = popup.getAttribute("data-open-scroll-type");
          const pointScrollPosition = Number(
            popup.getAttribute("data-open-scroll-position")
          );
          document.addEventListener("scroll", function () {
            if (pointScrollType === "px") {
              if (window.scrollY >= pointScrollPosition) {
                $this.openPopup(popup);
              }
            }
            if (pointScrollType === "%") {
              if ($this.getScrollPercent() >= pointScrollPosition) {
                $this.openPopup(popup);
              }
            }
          });
        }
        // Accept Agreement.
        if (trigger === "accept") {
          let accept = $this.getCookie(
            "popup-accept-" + popup.getAttribute("data-id") || 0
          );
          if (!accept) {
            $this.openPopup(popup);
          }
        }
      },

      /*
       * Trigger close popup
       */
      closeTriggerPopup: function (popup) {
        var trigger = popup.getAttribute("data-close-trigger");
        // Time Delay.
        if (trigger === "delay") {
          setTimeout(function () {
            $this.closePopup(popup);
          }, parseInt(popup.getAttribute("data-close-delay-number")) * 1000);
        }
        // Scroll Position.
        if (trigger === "scroll") {
          const pointScrollType = popup.getAttribute("data-close-scroll-type");
          const pointScrollPosition = Number(
            popup.getAttribute("data-close-scroll-position")
          );

          document.addEventListener("scroll", function () {
            if (pointScrollType === "px") {
              if (window.scrollY >= pointScrollPosition) {
                $this.closePopup(popup);
              }
            }

            if (pointScrollType === "%") {
              if ($this.getScrollPercent() >= pointScrollPosition) {
                $this.closePopup(popup);
              }
            }
          });
        }
      },

      /*
       * Open popup
       */
      openPopup: function (popup) {
        // Check already opened.
        if (popup.classList.contains("popup-already-opened")) {
          return;
        }
        if (popup.classList.contains("popup-open")) {
          return;
        }
        // Hide body scroll.
        if (popup.getAttribute("data-body-scroll-disable") === "true") {
          document.body.classList.add("popup-scroll-hidden");

          if (popup.getAttribute("data-mobile-disable") === "false") {
            document.body.classList.add("popup-scroll-hidden-mobile");
          }
        }

        // Set Cookie of Limit display.
        let limit =
          parseInt(
            $this.getCookie("popup-" + popup.getAttribute("data-id")) || 0
          ) + 1;
        $this.setCookie("popup-" + popup.getAttribute("data-id"), limit, {
          expires: popup.getAttribute("data-limit-lifetime"),
        });

        // Display popup.
        popup.classList.add("popup-open");
        // Set current scroll.
        popup.setAttribute("data-init-scroll-px", window.scrollY);
        popup.setAttribute(
          "data-init-scroll-percent",
          $this.getScrollPercent()
        );
        // Open animation.
        let animation = popup.getAttribute("data-open-animation");
        $this.applyAnimation(popup, animation);
        // Init close trigger.
        $this.closeTriggerPopup(popup);

        popup.focus();
      },

      /*
       * Age popup
       */
      agePopup: function (event) {
        let el = event.target ? event.target : event;

        // Get popup container.
        let popup = el.closest(".popup");
        // Set Cookie of Age.
        $this.setCookie("popup-age-" + popup.getAttribute("data-id"), 1, {
          expires: 360,
        });
      },

      /*
       * Age declined
       */
      ageDeclined: function () {
        document
          .querySelectorAll(".age-verification__question")
          .forEach(function (el) {
            el.classList.remove("show");
          });
        document
          .querySelector(".age-verification__declined")
          ?.classList.add("show");

        // Remove all sections except age verification
        if (!window.Shopify.designMode) {
          document.querySelectorAll(".shopify-section").forEach((el) => {
            if (!el.classList.contains("age-verification-section")) {
              el.remove();
            }
          });
        }
      },

      /*
       * Accept popup
       */
      acceptPopup: function (event) {
        let el = event.target ? event.target : event;

        // Get popup container.
        let popup = el.closest(".popup");
        // Set Cookie of Accept.
        $this.setCookie("popup-accept-" + popup.getAttribute("data-id"), 1, {
          expires: 360,
        });
      },

      /*
       * Close popup
       */
      closePopup: function (event) {
        let el = event.target ? event.target : event;
        // Get popup container.
        let popup = el.closest(".popup");
        // Close animation.
        let animation = popup.getAttribute("data-exit-animation");
        $this.applyAnimation(popup, animation, function () {
          // Already opened.
          popup.classList.add("popup-already-opened");
          // Hide popup.
          popup.classList.remove("popup-open");

          popup.blur();
        });
        document.body.classList.remove("popup-scroll-hidden");
        document.body.classList.remove("popup-scroll-hidden-mobile");
      },

      /*
       * Checks whether a popup should be displayed or not
       */
      isAllowPopup: function (popup) {
        // Has user seen this popup before?
        let limitDisplay = parseInt(
          popup.getAttribute("data-limit-display") || 0
        );
        let limitDisplayCookie = parseInt(
          $this.getCookie("popup-" + popup.getAttribute("data-id"))
        );
        if (
          limitDisplay &&
          limitDisplayCookie &&
          limitDisplayCookie >= limitDisplay
        ) {
          return false;
        }
        return true;
      },

      /*
       * Apply animation
       */
      applyAnimation: function (el, name, callback) {
        var popup = el.closest(".popup");
        let overlayName;
        if (typeof callback === "function") {
          overlayName = "popupExitFade";
        } else {
          overlayName = "popupOpenFade";
        }
        // Overlay Animation.
        if (popup.nextElementSibling) {
          popup.nextElementSibling.classList.add("popup-animated", overlayName);
          popup.nextElementSibling.addEventListener(
            "animationend",
            function () {
              this.classList.remove("popup-animated", overlayName);
            }
          );
        }
        // Wrap Animation.
        popup
          .querySelector(".popup-wrap")
          .classList.add("popup-animated", name);
        popup
          .querySelector(".popup-wrap")
          .addEventListener("animationend", function () {
            // remove the animation classes after animation ends
            // required in order to apply new animation on close
            this.classList.remove("popup-animated", name);
            if (typeof callback === "function") {
              callback();
            }
          });
      },

      /*
       * Set cookie
       */
      getCookie: function (name) {
        var matches = document.cookie.match(
          new RegExp(
            "(?:^|; )" +
              name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
              "=([^;]*)"
          )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
      },

      /*
       * Set cookie
       */
      setCookie: function (name, value, options) {
        options = options || {};
        options.path = options.hasOwnProperty("path") ? options.path : "/";
        options.expires = parseInt(options.expires);
        if (typeof options.expires == "number" && options.expires) {
          options.expires = new Date().setDate(
            new Date().getDate() + options.expires
          );
          options.expires = new Date(options.expires).toUTCString();
        }
        value = encodeURIComponent(value);
        var updatedCookie = name + "=" + value;
        for (var propName in options) {
          updatedCookie += "; " + propName;
          var propValue = options[propName];
          if (propValue !== true) {
            updatedCookie += "=" + propValue;
          }
        }
        document.cookie = updatedCookie;
      },

      /*
       * Get scroll percent
       */
      getScrollPercent: function () {
        const h = document.documentElement,
          b = document.body,
          st = "scrollTop",
          sh = "scrollHeight";
        return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
      },
    };
  })();

  // Initialize.
  adpPopup.init();

  document.addEventListener("shopify:section:load", function () {
    adpPopup.init();
  });

  document.addEventListener("shopify:section:unload", function () {
    document.body.classList.remove("popup-scroll-hidden");
  });
});
