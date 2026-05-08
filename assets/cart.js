class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItems =
        this.closest("cart-items") || this.closest("cart-drawer-items");
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

if (!customElements.get("cart-remove-button")) {
  customElements.define("cart-remove-button", CartRemoveButton);
}

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById("shopping-cart-line-item-status") ||
      document.getElementById("CartDrawer-LineItemStatus");

    if (document.querySelector(".cart-shipping")) {
      this.initCartShipping();
    }

    if (document.querySelector(".cart-drawer__recommended")) {
      this.initTabsRecommendedProducts();
    }

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener("change", debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  initCartShipping() {
    const cartShippingEl = document.querySelector(".cart-shipping");
    if (!cartShippingEl) return;

    let progressPrev = getComputedStyle(
      cartShippingEl.querySelector(".cart-shipping__progress-current")
    )?.getPropertyValue("width");
    cartShippingEl.style.setProperty("--progress-prev", progressPrev);

    const total = cartShippingEl.dataset.total;
    const minSpend = cartShippingEl.dataset.minSpend;
    const messageTemplate = cartShippingEl.dataset.message;

    const minTotal = Math.round(minSpend * (Shopify.currency.rate || 1));
    let progress = (total / minTotal) * 100;

    if (progress > 100) progress = 100;

    if (minTotal > total) {
      let amount = minTotal - total;
      let message = messageTemplate.replace("[amount]", formatMoney(amount));
      cartShippingEl.querySelector(
        ".cart-shipping__message_default"
      ).innerHTML = message;
      cartShippingEl
        .querySelector(".cart-shipping__message_success")
        .classList.remove("active");
      cartShippingEl
        .querySelector(".cart-shipping__message_default")
        .classList.add("active");
      cartShippingEl
        .querySelector(".cart-shipping__progress")
        .classList.remove("cart-shipping__progress--success");
    } else {
      cartShippingEl
        .querySelector(".cart-shipping__message_default")
        .classList.remove("active");
      cartShippingEl
        .querySelector(".cart-shipping__message_success")
        .classList.add("active");
      cartShippingEl
        .querySelector(".cart-shipping__progress")
        .classList.add("cart-shipping__progress--success");
    }

    cartShippingEl.querySelector(
      ".cart-shipping__progress-current"
    ).style.width = progress + "%";
  }

  initTabsRecommendedProducts() {
    const wrapperEl = document.querySelector(".cart-drawer__recommended");
    if (!wrapperEl) return;

    const tabsEl = wrapperEl.querySelectorAll(".cart-drawer__recommended-tab");
    const listEl = wrapperEl.querySelectorAll(".cart-drawer__recommended-list");

    const onClickTab = (event) => {
      event.preventDefault();
      const tab = event.currentTarget;
      if (
        tab.classList.contains("active") ||
        !tab.classList.contains("cart-drawer__recommended-tab")
      ) {
        return;
      }
      const tabIndex = tab.dataset.index;
      tabsEl.forEach((el) => {
        el.classList.remove("active");
      });
      tab.classList.add("active");
      listEl.forEach((el) => {
        el.classList.remove("active");
        const listIndex = el.dataset.index;
        if (listIndex === tabIndex) {
          el.classList.add("active");
        }
      });
    };

    tabsEl.forEach((tab) => {
      tab.addEventListener("click", onClickTab);
    });
  }

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => {
        if (event.source === "cart-items") {
          return;
        }
        this.onCartUpdate();
      }
    );
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  onChange(event) {
    this.updateQuantity(
      event.target.dataset.index,
      event.target.value,
      document.activeElement.getAttribute("name")
    );
  }

  onCartUpdate() {
    fetch(`${routes.cart_url}?section_id=main-cart-items`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const sourceQty = html.querySelector("cart-items");
        this.innerHTML = sourceQty.innerHTML;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents-totals",
      },
      {
        id: "main-cart-shipping",
        section:
          document.getElementById("main-cart-shipping")?.dataset.id || null,
        selector: ".js-contents-shipping",
      },
    ];
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    this.querySelectorAll(".quantity__button").forEach((button) =>
      button.classList.add("disabled")
    );

    if (
      document.querySelectorAll(
        '.card--product card__add-to-cart button[name="add"]'
      )
    ) {
      document
        .querySelectorAll(
          '.card--product .card__add-to-cart button[name="add"], .card--product .card__link--add-to-cart_show'
        )
        .forEach((button) => {
          button.setAttribute("aria-disabled", false);
          button.removeAttribute("disabled");
          if (button.querySelector("span")) {
            button.querySelector("span").classList.remove("hidden");
            button.querySelector(".sold-out-message")?.classList.add("hidden");
          }
        });
    }

    if (document.querySelector(".cart-shipping__progress")) {
      let progressPrev = getComputedStyle(
        document.querySelector(".cart-shipping__progress-current")
      ).getPropertyValue("width");
      document.documentElement.style.setProperty(
        "--progress-prev",
        progressPrev
      );
    }

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender()
        .filter((section) => section.section)
        .map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        const quantityElement =
          document.getElementById(`Quantity-${line}`) ||
          document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll(".cart-item");
        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute("value");
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle("is-empty", parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector("cart-drawer");
        const cartFooter = document.getElementById("main-cart-footer");

        if (cartFooter) {
          cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
        }
        if (cartDrawerWrapper) {
          cartDrawerWrapper.classList.toggle(
            "is-empty",
            parsedState.item_count === 0
          );
        }

        this.getSectionsToRender()
          .filter((section) => section.section)
          .forEach((section) => {
            const elementToReplace =
              document
                .getElementById(section.id)
                ?.querySelector(section.selector) ||
              document.getElementById(section.id);
            if (elementToReplace) {
              elementToReplace.innerHTML = this.getSectionInnerHTML(
                parsedState.sections[section.section],
                section.selector
              );
            }
          });
        const updatedValue = parsedState.items[line - 1]
          ? parsedState.items[line - 1].quantity
          : undefined;
        let message = "";
        if (
          items.length === parsedState.items.length &&
          updatedValue !== parseInt(quantityElement.value)
        ) {
          if (typeof updatedValue === "undefined") {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace(
              "[quantity]",
              updatedValue
            );
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) ||
          document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(
                cartDrawerWrapper,
                lineItem.querySelector(`[name="${name}"]`)
              )
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper.querySelector(".cart-drawer__empty"),
            cartDrawerWrapper.querySelector("a")
          );
          if (cartDrawerWrapper.querySelector(".cart-drawer__recommended")) {
            this.initTabsRecommendedProducts();
            try {
              colorSwatches();
            } catch (err) {}
          }
        } else if (document.querySelector(".cart-item") && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper,
            document.querySelector(".cart-item__name")
          );
        }
        publish(PUB_SUB_EVENTS.cartUpdate, { source: "cart-items" });
      })
      .catch((error) => {
        this.querySelectorAll(".loading-overlay").forEach((overlay) =>
          overlay.classList.add("hidden")
        );
        this.querySelectorAll(".quantity__button").forEach((button) =>
          button.classList.remove("disabled")
        );
        const errors =
          document.getElementById("cart-errors") ||
          document.getElementById("CartDrawer-CartErrors");
        if (errors) errors.textContent = window.cartStrings.error;
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        this.querySelectorAll(".quantity__button").forEach((button) =>
          button.classList.remove("disabled")
        );
        if (document.querySelector(".cart-shipping")) {
          this.initCartShipping();
        }
        this.disableLoading(line);
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) ||
      document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError)
      lineItemError.querySelector(".cart-item__error-text").innerHTML = message;

    this.lineItemStatusElement.setAttribute("aria-hidden", true);

    const cartStatus =
      document.getElementById("cart-live-region-text") ||
      document.getElementById("CartDrawer-LiveRegionText");
    cartStatus.setAttribute("aria-hidden", false);

    setTimeout(() => {
      cartStatus.setAttribute("aria-hidden", true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById("main-cart-items");
    if (mainCartItems) {
      const cartItemTotalsEl = this.querySelectorAll(
        `#CartItem-${line} .cart-item__totals`
      );
      const cartItemLoadingEl = this.querySelectorAll(
        `#CartItem-${line} .loading-overlay`
      );

      cartItemTotalsEl.forEach((el) => el.classList.add("loading"));
      cartItemLoadingEl.forEach((overlay) =>
        overlay.classList.remove("hidden")
      );
    }

    const cartDrawer = document.getElementById("CartDrawer");
    if (cartDrawer) {
      const cartDrawerItemEl = this.querySelector(`#CartDrawer-Item-${line}`);
      const loadingEl = cartDrawerItemEl.querySelector(".loading-overlay");

      cartDrawerItemEl.classList.add("loading");
      loadingEl.classList.remove("hidden");
    }

    const totalsSubtotal = document.querySelector(".totals__subtotal-value");
    if (totalsSubtotal) {
      totalsSubtotal.classList.add("loading");
      const loadingEl = totalsSubtotal.querySelector(".loading-overlay");
      loadingEl.classList.remove("hidden");
    }

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById("main-cart-items");
    if (mainCartItems) {
      const cartItemTotalsEl = this.querySelectorAll(
        `#CartItem-${line} .cart-item__totals`
      );
      const cartItemLoadingEl = this.querySelectorAll(
        `#CartItem-${line} .loading-overlay`
      );

      cartItemTotalsEl.forEach((el) => el.classList.remove("loading"));
      cartItemLoadingEl.forEach((overlay) => overlay.classList.add("hidden"));
    }

    const cartDrawer = document.getElementById("CartDrawer");
    if (cartDrawer) {
      const cartDrawerItemEl = this.querySelector(`#CartDrawer-Item-${line}`);
      const loadingEl = cartDrawerItemEl.querySelector(".loading-overlay");

      cartDrawerItemEl.classList.remove("loading");
      loadingEl.classList.add("hidden");
    }

    const totalsSubtotal = document.querySelector(".totals__subtotal-value");
    if (totalsSubtotal) {
      totalsSubtotal.classList.remove("loading");
      const loadingEl = totalsSubtotal.querySelector(".loading-overlay");
      loadingEl.classList.add("hidden");
    }
  }
}

if (!customElements.get("cart-items")) {
  customElements.define("cart-items", CartItems);
}

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.header = document.querySelector(".header-wrapper");
    if (this.header) this.header.preventHide = false;

    this.addEventListener(
      "keyup",
      (evt) => evt.code === "Escape" && this.close()
    );
    this.querySelector("#CartDrawer-Overlay").addEventListener(
      "click",
      this.close.bind(this, false)
    );
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector("#cart-icon-bubble");
    if (!cartLink) return;
    cartLink.setAttribute("role", "button");
    cartLink.setAttribute("aria-haspopup", "dialog");
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (!this.classList.contains("active")) {
        this.open(cartLink);
      } else {
        this.close();
      }
    });
  }

  open(triggeredBy) {
    if (this.header) {
      this.header.preventHide = true;
      this.header.preventReveal = true;
    }
    if (triggeredBy) this.setActiveElement(triggeredBy);

    const search = document.querySelector("header-search.header-search");
    if (search) search.close();

    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute("role")) {
      this.setSummaryAccessibility(cartDrawerNote);
    }

    this.classList.add("active");

    this.addEventListener(
      "transitionend",
      () => {
        const containerToTrapFocusOn = this.classList.contains("is-empty")
          ? this.querySelector(".cart-drawer__empty")
          : document.getElementById("CartDrawer");
        const focusElement =
          this.querySelector(".cart-drawer__inner") ||
          this.querySelector(".cart-drawer__header-close");
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add("overflow-hidden-drawer");
  }

  close() {
    this.classList.remove("active");

    if (this.activeElement) {
      const productCard = this.activeElement.closest(
        ".collection-product-card"
      );
      const productCardLink = productCard?.querySelector(
        ".card-wrapper__link--overlay"
      );
      if (productCardLink) {
        removeTrapFocus(productCardLink);
      } else {
        removeTrapFocus(this.activeElement);
      }
    }

    document.body.classList.remove("overflow-hidden-drawer");

    if (this.header) {
      this.header.preventHide = false;
      this.header.preventReveal = false;
    }
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute("role", "button");
    cartDrawerNote.setAttribute("aria-expanded", "false");

    if (cartDrawerNote.nextElementSibling.getAttribute("id")) {
      cartDrawerNote.setAttribute(
        "aria-controls",
        cartDrawerNote.nextElementSibling.id
      );
    }

    cartDrawerNote.addEventListener("click", (event) => {
      event.currentTarget.setAttribute(
        "aria-expanded",
        !event.currentTarget.closest("details").hasAttribute("open")
      );
    });

    cartDrawerNote.parentElement.addEventListener("keyup", onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector(".cart-drawer__inner").classList.contains("is-empty") &&
      this.querySelector(".cart-drawer__inner").classList.remove("is-empty");
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector
      );
    });

    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener(
        "click",
        this.close.bind(this, false)
      );
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: "cart-drawer",
        selector: "#CartDrawer",
      },
      {
        id: "cart-icon-bubble",
      },
    ];
  }

  getSectionDOM(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

if (!customElements.get("cart-drawer")) {
  customElements.define("cart-drawer", CartDrawer);
}

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: ".cart-drawer__inner",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
    ];
  }
}

if (!customElements.get("cart-drawer-items")) {
  customElements.define("cart-drawer-items", CartDrawerItems);
}

class CartNote extends HTMLElement {
  constructor() {
    super();
    this.spinnerIcon = this.querySelector(".cart__note-loading");
    this.successIcon = this.querySelector(".cart__note-success");
    this.textarea = this.querySelector("textarea");
    this.cartButtons = document.querySelector(".cart__ctas");
    this.drawerButtons = document.querySelector(".cart-drawer__buttons");

    this.textarea.addEventListener(
      "input",
      debounce((event) => {
        if (this.spinnerIcon) this.spinnerIcon.style.display = "flex";
        if (this.successIcon) this.successIcon.style.display = "none";
        if (this.cartButtons) this.cartButtons.style.pointerEvents = "none";
        if (this.cartButtons) this.cartButtons.style.opacity = "0.7";
        if (this.drawerButtons) this.drawerButtons.style.pointerEvents = "none";
        if (this.drawerButtons) this.drawerButtons.style.opacity = "0.7";

        const body = JSON.stringify({ note: event.target.value });

        fetch(`${routes.cart_update_url}`, {
          ...fetchConfig(),
          ...{ body },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (this.successIcon) this.successIcon.style.display = "flex";

            setTimeout(() => {
              if (this.successIcon) this.successIcon.style.display = "none";
            }, 2000);
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          })
          .finally(() => {
            if (this.spinnerIcon) this.spinnerIcon.style.display = "none";
            if (this.cartButtons) this.cartButtons.removeAttribute("style");
            if (this.drawerButtons) this.drawerButtons.removeAttribute("style");
          });
      }, 500)
    );
  }
}

if (!customElements.get("cart-note")) {
  customElements.define("cart-note", CartNote);
}
