if (!customElements.get("quick-add-modal")) {
  customElements.define(
    "quick-add-modal",
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

        window.addEventListener("keyup", (evt) => {
          if (evt.code === "Escape" && this.classList.contains("active")) {
            this.hide();
          }
        });

        window.addEventListener("resize", () => {
          this.modalContent
            .querySelectorAll(".js-media-list")
            .forEach((element) => {
              element.swiper?.destroy();
            });
          this.modalContent
            .querySelectorAll(".js-media-sublist")
            .forEach((element) => {
              element.swiper?.destroy();
            });

          setTimeout(() => {
            subSliderInit(this.modalContent);
            sliderInit(this.modalContent);
          }, 200);
        });
      }

      hide(preventFocus = false) {
        this.modalContent.innerHTML = "";

        this.modalContent
          .querySelectorAll(".js-media-list")
          .forEach(function () {
            this.swiper?.destroy();
          });
        this.modalContent
          .querySelectorAll(".js-media-sublist")
          .forEach(function () {
            this.swiper?.destroy();
          });

        subSliderInit(this.modalContent);
        sliderInit(this.modalContent);

        if (preventFocus) this.openedBy = null;

        this.classList.remove("active");
        super.hide();

        this.addEventListener(
          "transitionend",
          () => {
            this.openedBy.closest(".card__links")?.nextElementSibling.focus();
          },
          { once: true }
        );
      }

      show(opener) {
        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");
        const spinner = opener.querySelector(".loading-overlay__spinner");
        if (spinner) {
          spinner.classList.remove("hidden");
        }

        fetch(opener.getAttribute("data-product-url"))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            this.productElement = responseHTML.querySelector(
              'section[id^="MainProduct-"]'
            );
            this.preventDuplicatedIDs();
            this.removeDOMElements();
            this.setInnerHTML(
              this.modalContent,
              this.productElement.innerHTML,
              opener
            );

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }

            if (window.ProductModel) window.ProductModel.loadShopifyXR();

            this.updateImageSizes();
            this.preventVariantURLSwitching();
            setTimeout(() => {
              this.classList.add("active");
            });
            super.show(opener);

            this.addEventListener(
              "transitionend",
              () => {
                const containerToTrapFocusOn = this;
                const focusElement = this.querySelector(
                  "a, button, input, textarea"
                );
                trapFocus(containerToTrapFocusOn, focusElement);
              },
              { once: true }
            );
          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");

            if (opener.querySelector(".loading-overlay__spinner")) {
              opener
                .querySelector(".loading-overlay__spinner")
                .classList.add("hidden");
            }

            this.modalContent
              .querySelectorAll(".js-media-list")
              .forEach((element) => {
                element.swiper?.destroy();
              });

            this.modalContent
              .querySelectorAll(".js-media-sublist")
              .forEach((element) => {
                element.swiper?.destroy();
              });

            subSliderInit(this.modalContent);
            sliderInit(this.modalContent);

            selectDropDown(this);
            this.initDropdown();
            this.copyFunction();
          });
      }

      setInnerHTML(element, html, opener) {
        element.innerHTML = html;
        // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
        element.querySelectorAll("script").forEach((oldScriptTag) => {
          const newScriptTag = document.createElement("script");
          Array.from(oldScriptTag.attributes).forEach((attribute) => {
            newScriptTag.setAttribute(attribute.name, attribute.value);
          });
          newScriptTag.appendChild(
            document.createTextNode(oldScriptTag.innerHTML)
          );
          oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
        });

        // Read more button
        const moreBtn = document.createElement("a");
        moreBtn.innerHTML = `<span class="button__label">${theme.quickviewMore}</span><svg class="icon icon-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.6333 12.5L8 6.86673L8.86673 6L15.3667 12.5L8.86673 19L8 18.1333L13.6333 12.5Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"/>
</svg>`;
        moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
        moreBtn.setAttribute(
          "class",
          "product__full-details button button--link--tertiary link--underline_arrow focus-inset"
        );
        if (
          element.querySelectorAll(".product__info-column") &&
          element.querySelectorAll(".product__info-column").length > 0
        ) {
          element
            .querySelector(".main-information .product__info-block")
            ?.appendChild(moreBtn);
        }
      }

      removeDOMElements() {
        const popup = this.productElement.querySelectorAll(".product-popup");
        if (popup)
          popup.forEach((el) => {
            if (!el?.classList.contains("size-guide")) {
              el.remove();
            }
          });

        const sku = this.productElement.querySelector(".product__sku");
        if (sku) sku.remove();

        const breadcrumb = this.productElement.querySelector(".breadcrumb");

        if (breadcrumb) breadcrumb.remove();

        const tags = this.productElement.querySelector(".product-tags");
        if (tags) tags.remove();

        const bigProductModal =
          this.productElement.querySelector("product-modal");
        if (bigProductModal) bigProductModal.remove();

        const rating = this.productElement.querySelector(".rating-wrapper");
        if (rating) rating.remove();
        const pickupAvailability = this.productElement.querySelector(
          ".product__pickup-wrapper"
        );
        if (pickupAvailability) pickupAvailability.remove();

        const promoCode = this.productElement.querySelector(".promo-code");
        if (promoCode) promoCode.remove();

        const productDescr = this.productElement.querySelector(
          ".product__description"
        );

        if (productDescr) productDescr.remove();

        const recommendations = this.productElement.querySelector(
          ".product-recommendations__outer"
        );
        if (recommendations) recommendations.remove();

        const miniWidgets = this.productElement.querySelector(".mini-widgets");
        if (miniWidgets) miniWidgets.remove();

        const productMarkers =
          this.productElement.querySelector(".product-markers");
        if (productMarkers) productMarkers.remove();

        const productBanners =
          this.productElement.querySelectorAll(".product-banner");
        if (productBanners) productBanners.forEach((banner) => banner.remove());

        const helpBanners = this.productElement.querySelector(".help-banner");
        if (helpBanners) helpBanners.remove();

        const similarProducts =
          this.productElement.querySelector(".similar-products");
        if (similarProducts) similarProducts.remove();

        const recentlyViewed = this.productElement.querySelector(
          ".recently-viewed-outer"
        );
        if (recentlyViewed) recentlyViewed.remove();
      }

      preventDuplicatedIDs() {
        const sectionId = this.productElement.dataset.section;
        this.productElement.innerHTML =
          this.productElement.innerHTML.replaceAll(
            sectionId,
            `quickadd-${sectionId}`
          );
        this.productElement
          .querySelectorAll("variant-selects, variant-radios")
          .forEach((variantSelect) => {
            variantSelect.dataset.originalSection = sectionId;
          });
      }

      preventVariantURLSwitching() {
        if (this.modalContent.querySelector("variant-radios,variant-selects")) {
          this.modalContent
            .querySelector("variant-radios,variant-selects")
            .setAttribute("data-update-url", "false");
        }
      }

      initDropdown = () => {
        const dropdowns = this.querySelectorAll(".dropdown-opener");
        if (!dropdowns) return;

        dropdowns.forEach((dropdown) => {
          dropdown.addEventListener("click", () => {
            dropdown.classList.toggle("active");
          });
        });

        document.addEventListener("click", (event) => {
          if (
            !event.target.closest(".dropdown-opener") &&
            !event.target.closest(".share-buttons__list") &&
            !event.target.closest(".copy")
          ) {
            dropdowns.forEach((dropdown) => {
              dropdown.classList.remove("active");
            });
          } else if (event.target?.closest(".copy")) {
            setTimeout(() => {
              dropdowns.forEach((dropdown) => {
                dropdown.classList.remove("active");
              });
            }, 800);
          }
        });
      };

      updateImageSizes() {
        const product = this.modalContent.querySelector(".product");
        if (!product) return;

        const mediaImages = product.querySelectorAll(
          ".product__media-item .product__media img"
        );
        if (!mediaImages?.length) return;

        let mediaImageSizes =
          "(min-width: 990px) 42.9rem, (min-width: 576px) 48rem, 100vw";

        let mediasubItems = product.querySelectorAll(
          ".product__media-subitem .product__media img"
        );
        mediaImages.forEach((img) =>
          img.setAttribute("sizes", mediaImageSizes)
        );

        mediasubItems.forEach((img) => img.setAttribute("sizes", "6rem"));
      }

      copyFunction() {
        function copyURI(e, copyLink) {
          e.preventDefault();

          const textToCopy = copyLink.dataset.copyHref;

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

          if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(
              () => {
                handleCopy(copyLink, true);
              },
              () => {
                handleCopy(copyLink, false);
              }
            );
          }
        }

        const copyLinks = this.querySelectorAll(".copy-btn");

        if (copyLinks.length) {
          for (const copyLink of copyLinks) {
            copyLink.addEventListener("click", (e) => copyURI(e, copyLink));
          }
        }
      }
    }
  );
}
