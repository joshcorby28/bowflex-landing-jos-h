(function () {
  // fallback via execCommand (works in iframes + older browsers)
  function fallbackCopyTextToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch (err) {
      console.error("execCommand fallback failed:", err);
    }
    document.body.removeChild(textarea);
    return successful;
  }

  function copyCode(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const promocode = btn.dataset.code;

    if (!promocode) {
      console.warn("🏷️ No data-code on button:", btn);
      return;
    }

    const handleCopy = (success) => {
      btn.classList.toggle("copied", success);
      btn.classList.toggle("notCopied", !success);
      setTimeout(() => {
        btn.classList.remove("copied", "notCopied");
      }, 1000);
    };

    // Use native Clipboard API only if not in an iframe and in a secure context
    if (
      navigator.clipboard?.writeText &&
      window.isSecureContext &&
      window.self === window.top
    ) {
      navigator.clipboard
        .writeText(promocode)
        .then(() => handleCopy(true))
        .catch((err) => {
          console.warn("Clipboard API failed, falling back:", err);
          handleCopy(fallbackCopyTextToClipboard(promocode));
        });
    } else {
      // always fallback inside iframe or insecure contexts
      handleCopy(fallbackCopyTextToClipboard(promocode));
    }
  }

  function bindAll() {
    document.querySelectorAll(".promocode-button-copy").forEach((btn) => {
      // avoid double-binding
      btn.removeEventListener("click", copyCode);
      btn.addEventListener("click", copyCode);
    });
  }

  document.addEventListener("DOMContentLoaded", bindAll);
  document.addEventListener("shopify:section:load", bindAll);
})();
