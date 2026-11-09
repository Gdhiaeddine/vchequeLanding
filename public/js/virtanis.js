/* ==========================================================================
   VCHEQUE — comportements UI (vanilla ES6+)
   - État d'en-tête au défilement (ombre + fond)
   - Menu de navigation mobile accessible
   Aucune logique de paiement ou d'activation ici :
   celles-ci sont gérées uniquement par le backend Laravel.
   ========================================================================== */
(function () {
  "use strict";

  var dpr = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = dpr.matches;
  dpr.addEventListener("change", function (e) {
    reduceMotion = e.matches;
  });

  /* ------------------------------------------------------------------ */
  /* État d'en-tête au défilement                                        */
  /* ------------------------------------------------------------------ */
  var header = document.querySelector("[data-elevate]");
  if (header) {
    var ticking = false;
    var updateHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateHeaderState);
        }
      },
      { passive: true }
    );
    updateHeaderState();
  }

  /* ------------------------------------------------------------------ */
  /* Navigation mobile accessible                                        */
  /* ------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-nav");

  if (toggle && panel) {
    var isOpen = function () {
      return toggle.getAttribute("aria-expanded") === "true";
    };

    var open = function () {
      toggle.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
      document.body.classList.add("menu-open");
      var first = panel.querySelector("a, button");
      if (first) {
        first.focus();
      }
    };

    var close = function (returnFocus) {
      if (!isOpen()) {
        return;
      }
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      if (returnFocus !== false) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        close();
      } else {
        open();
      }
    });

    /* Échap : fermeture */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        close();
      }
    });

    /* Trap de focus circulaire entre le bouton bascule et le panneau */
    var trapFocus = function (event) {
      if (event.key !== "Tab" || !isOpen()) {
        return;
      }
      var inside =
        panel.contains(event.target) || toggle.contains(event.target);
      if (!inside) {
        /* le focus se trouve ailleurs (p. ex. via clic souris) : rien à piéger */
        return;
      }
      var focusable = Array.prototype.slice.call(
        panel.querySelectorAll("a, button")
      );
      if (!focusable.length) {
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (toggle.contains(event.target)) {
        if (!event.shiftKey) {
          /* tab avant depuis le bouton : entrer dans le panneau */
          event.preventDefault();
          first.focus();
        }
        return;
      }

      /* focus dans le panneau */
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        toggle.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);

    /* Fermeture : clic sur un lien du panneau ou clic extérieur */
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        close(false); /* le lien prend naturellement le focus à la navigation */
      }
    });
    document.addEventListener("click", function (event) {
      if (
        isOpen() &&
        !panel.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        close();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ accessible : accordéon (attention gardée en HTML sans JS)       */
  /* ------------------------------------------------------------------ */
  var faqList = document.querySelector(".faq-list");
  if (faqList) {
    var faqButtons = Array.prototype.slice.call(
      faqList.querySelectorAll(".faq-q button")
    );

    faqButtons.forEach(function (button) {
      var panel = document.getElementById(
        button.getAttribute("aria-controls")
      );
      if (!panel) {
        return;
      }

      var setOpen = function (open) {
        button.setAttribute("aria-expanded", String(open));
        panel.classList.toggle("is-open", open);
      };

      button.addEventListener("click", function () {
        setOpen(button.getAttribute("aria-expanded") !== "true");
      });
    });

    /* Navigation clavier : ↑ / ↓ / début / fin entre les questions */
    faqList.addEventListener("keydown", function (event) {
      var current = faqButtons.indexOf(event.target);
      if (current === -1) {
        return;
      }
      var target = null;
      if (event.key === "ArrowDown") {
        target = faqButtons[current === faqButtons.length - 1 ? 0 : current + 1];
      } else if (event.key === "ArrowUp") {
        target = faqButtons[current === 0 ? faqButtons.length - 1 : current - 1];
      } else if (event.key === "Home") {
        target = faqButtons[0];
      } else if (event.key === "End") {
        target = faqButtons[faqButtons.length - 1];
      }
      if (target) {
        event.preventDefault();
        target.focus();
      }
    });
  }

  /* --------------------------------------------------------------------
     Formulaire de commande (/commander) — état « envoi en cours » :
     étiquette, désactivation du bouton et blocage des envois multiples.
     Aucun état de succès n'est simulé ici : c'est le serveur qui renvoie
     la réponse (erreurs en ligne ou message honnête).
     -------------------------------------------------------------------- */
  var checkoutForm = document.getElementById("checkout-form");
  var submitBtn = checkoutForm ? checkoutForm.querySelector(".checkout-submit") : null;
  if (checkoutForm && submitBtn) {
    checkoutForm.addEventListener("submit", function (event) {
      if (submitBtn.disabled) {
        event.preventDefault();
        return;
      }
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.setAttribute("aria-busy", "true");
      var label = submitBtn.querySelector(".checkout-submit-label");
      if (label) {
        label.textContent =
          submitBtn.getAttribute("data-loading-label") || "Traitement…";
      }
    });
  }
})();
