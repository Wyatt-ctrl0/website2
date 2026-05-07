/* ===========================================
   MOLLY & SOPHIE - Shopify Theme JS
   =========================================== */

(function() {
  'use strict';

  // ---------- Helpers ----------
  function formatMoney(cents, format) {
    var fmt = format || (window.theme && window.theme.moneyFormat) || '${{amount}}';
    var value = (cents / 100).toFixed(2);
    return fmt.replace(/\{\{\s*amount\s*\}\}/g, value).replace(/\{\{\s*amount_no_decimals\s*\}\}/g, Math.floor(cents / 100));
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  // ---------- Cart Store ----------
  var Cart = {
    state: { item_count: 0, total_price: 0, items: [], note: '' },
    listeners: [],
    
    subscribe: function(fn) { this.listeners.push(fn); },
    notify: function() {
      var self = this;
      this.listeners.forEach(function(fn) { fn(self.state); });
    },
    
    fetch: function() {
      var self = this;
      return fetch('/cart.js', { credentials: 'same-origin' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          self.state = data;
          self.notify();
          return data;
        })
        .catch(function() {
          // Demo fallback when not on Shopify
          self.notify();
          return self.state;
        });
    },
    
    add: function(variantId, quantity) {
      var self = this;
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id: variantId, quantity: quantity || 1 })
      })
        .then(function(r) { return r.json(); })
        .then(function() { return self.fetch(); });
    },
    
    change: function(line, quantity) {
      var self = this;
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ line: line, quantity: quantity })
      })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          self.state = data;
          self.notify();
          return data;
        });
    }
  };

  // ---------- Cart Drawer ----------
  function initCartDrawer() {
    var drawer = $('[data-cart-drawer]');
    var overlay = $('[data-cart-overlay]');
    if (!drawer) return;

    function open() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      Cart.fetch();
    }
    function close() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    $$('[data-cart-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        open();
      });
    });
    $$('[data-cart-close]').forEach(function(btn) {
      btn.addEventListener('click', close);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') close();
    });

    // Listen for add-to-cart events
    document.addEventListener('cart:added', open);
  }

  // ---------- Cart Renderer ----------
  function initCartRender() {
    Cart.subscribe(function(state) {
      // Update cart count
      $$('[data-cart-count]').forEach(function(el) {
        el.textContent = state.item_count || 0;
        el.setAttribute('data-count', state.item_count || 0);
      });

      // Update drawer body
      var body = $('[data-cart-body]');
      var footer = $('[data-cart-footer]');
      if (!body) return;

      if (!state.items || state.items.length === 0) {
        body.innerHTML = ''
          + '<div class="cart-drawer-empty">'
          + '<div class="icon">🐾</div>'
          + '<h3>Your pack is empty</h3>'
          + '<p>Add some goodies to spoil your furry friend.</p>'
          + '<a href="/collections/all" class="btn btn-primary mt-2">Start Shopping</a>'
          + '</div>';
        if (footer) footer.style.display = 'none';
        return;
      }

      if (footer) footer.style.display = 'block';

      var html = '';
      state.items.forEach(function(item, idx) {
        html += ''
          + '<div class="cart-item" data-line="' + (idx + 1) + '">'
          + '  <div class="cart-item-image"><img src="' + (item.image || '') + '" alt="' + item.title + '"></div>'
          + '  <div>'
          + '    <h4 class="cart-item-title">' + item.product_title + '</h4>'
          + (item.variant_title ? '    <div class="cart-item-variant">' + item.variant_title + '</div>' : '')
          + '    <div class="cart-item-controls">'
          + '      <button data-qty-change="-1" aria-label="Decrease">−</button>'
          + '      <span class="qty">' + item.quantity + '</span>'
          + '      <button data-qty-change="1" aria-label="Increase">+</button>'
          + '    </div>'
          + '  </div>'
          + '  <div>'
          + '    <div class="cart-item-price">' + formatMoney(item.final_line_price) + '</div>'
          + '    <button class="cart-item-remove" data-remove>Remove</button>'
          + '  </div>'
          + '</div>';
      });
      body.innerHTML = html;

      // Bind controls
      $$('.cart-item', body).forEach(function(itemEl) {
        var line = parseInt(itemEl.getAttribute('data-line'), 10);
        var item = state.items[line - 1];
        $$('[data-qty-change]', itemEl).forEach(function(btn) {
          btn.addEventListener('click', function() {
            var delta = parseInt(btn.getAttribute('data-qty-change'), 10);
            Cart.change(line, Math.max(0, item.quantity + delta));
          });
        });
        var rm = $('[data-remove]', itemEl);
        if (rm) rm.addEventListener('click', function() { Cart.change(line, 0); });
      });

      // Update subtotal
      var subtotal = $('[data-cart-subtotal]');
      if (subtotal) subtotal.textContent = formatMoney(state.total_price);

      // Update free shipping bar
      updateShippingBar(state.total_price);
    });
  }

  // ---------- Free Shipping Bar ----------
  function updateShippingBar(totalCents) {
    var threshold = (window.theme && window.theme.freeShippingThreshold) || 50;
    var thresholdCents = threshold * 100;
    var bar = $('[data-shipping-bar]');
    var fill = $('[data-shipping-fill]');
    var text = $('[data-shipping-text]');
    if (!bar) return;

    var pct = Math.min(100, (totalCents / thresholdCents) * 100);
    if (fill) fill.style.width = pct + '%';

    if (totalCents >= thresholdCents) {
      if (fill) fill.classList.add('is-complete');
      if (text) text.innerHTML = '🎉 You\'ve unlocked <strong>FREE SHIPPING!</strong>';
    } else {
      if (fill) fill.classList.remove('is-complete');
      var remaining = (thresholdCents - totalCents) / 100;
      if (text) text.innerHTML = 'Spend <strong>$' + remaining.toFixed(2) + '</strong> more for FREE shipping';
    }
  }

  // ---------- Promo Code (in cart drawer) ----------
  function initPromoCode() {
    var form = $('[data-promo-form]');
    if (!form) return;
    var input = $('[data-promo-input]', form);
    var msg = $('[data-promo-message]');
    var applied = $('[data-promo-applied]');
    var validCodes = {
      'WELCOME10': { type: 'percent', value: 10, label: '10% off' },
      'PETS15': { type: 'percent', value: 15, label: '15% off' },
      'FREESHIP': { type: 'shipping', value: 0, label: 'Free shipping' },
      'RESCUE20': { type: 'percent', value: 20, label: '20% off' }
    };
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var code = (input.value || '').toUpperCase().trim();
      if (!code) return;
      if (validCodes[code]) {
        msg.className = 'promo-message success';
        msg.textContent = '✓ Code accepted! ' + validCodes[code].label + ' will be applied at checkout.';
        applied.style.display = 'flex';
        $('[data-promo-code-name]', applied).textContent = code;
        $('[data-promo-code-label]', applied).textContent = validCodes[code].label;
        input.value = '';
        try { localStorage.setItem('msPromoCode', code); } catch(e) {}
      } else {
        msg.className = 'promo-message error';
        msg.textContent = '✗ That code isn\'t valid. Try WELCOME10!';
      }
    });
    
    var removeBtn = $('[data-promo-remove]');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        applied.style.display = 'none';
        msg.textContent = '';
        try { localStorage.removeItem('msPromoCode'); } catch(e) {}
      });
    }

    // Restore saved code
    try {
      var saved = localStorage.getItem('msPromoCode');
      if (saved && validCodes[saved]) {
        applied.style.display = 'flex';
        $('[data-promo-code-name]', applied).textContent = saved;
        $('[data-promo-code-label]', applied).textContent = validCodes[saved].label;
      }
    } catch(e) {}
  }

  // ---------- Promo Popup ----------
  function initPromoPopup() {
    var popup = $('[data-promo-popup]');
    if (!popup) return;
    if (!window.theme || !window.theme.promoEnabled) return;

    var dismissed = false;
    try { dismissed = localStorage.getItem('msPromoDismissed') === '1'; } catch(e) {}
    if (dismissed) return;

    setTimeout(function() {
      popup.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }, 1500);

    function close() {
      popup.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      try { localStorage.setItem('msPromoDismissed', '1'); } catch(e) {}
    }

    $$('[data-promo-popup-close]').forEach(function(btn) {
      btn.addEventListener('click', close);
    });

    var copyBtn = $('[data-promo-copy]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var code = window.theme.promoCode;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code);
        }
        copyBtn.textContent = 'Copied!';
        setTimeout(function() { copyBtn.textContent = 'Copy Code'; }, 2000);
      });
    }
  }

  // ---------- Mobile Nav ----------
  function initMobileNav() {
    var nav = $('[data-mobile-nav]');
    var overlay = $('[data-mobile-nav-overlay]');
    if (!nav) return;

    function open() {
      nav.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }
    function close() {
      nav.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    $$('[data-mobile-nav-toggle]').forEach(function(btn) { btn.addEventListener('click', open); });
    $$('[data-mobile-nav-close]').forEach(function(btn) { btn.addEventListener('click', close); });
    if (overlay) overlay.addEventListener('click', close);
  }

  // ---------- Add to Cart Form ----------
  function initAddToCartForms() {
    $$('form[action="/cart/add"]').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var btn = form.querySelector('[type="submit"]');
        var originalText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          credentials: 'same-origin',
          body: formData
        })
          .then(function(r) { return r.json(); })
          .then(function() {
            return Cart.fetch();
          })
          .then(function() {
            if (btn) { btn.disabled = false; btn.textContent = '✓ Added!'; }
            setTimeout(function() { if (btn) btn.textContent = originalText; }, 1500);
            document.dispatchEvent(new CustomEvent('cart:added'));
          })
          .catch(function() {
            if (btn) { btn.disabled = false; btn.textContent = originalText; }
          });
      });
    });
  }

  // ---------- Product Page Gallery ----------
  function initProductGallery() {
    var thumbs = $$('[data-product-thumb]');
    var main = $('[data-product-main-img]');
    if (!main || thumbs.length === 0) return;

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        thumbs.forEach(function(t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        var src = thumb.getAttribute('data-img');
        if (src) main.src = src;
      });
    });
  }

  // ---------- Product Variants ----------
  function initProductOptions() {
    $$('[data-option-value]').forEach(function(el) {
      el.addEventListener('click', function() {
        var group = el.getAttribute('data-option-group');
        $$('[data-option-group="' + group + '"]').forEach(function(o) { o.classList.remove('is-active'); });
        el.classList.add('is-active');
      });
    });
  }

  // ---------- Scroll reveal ----------
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // ---------- Image lightbox ----------
  function initLightbox() {
    var triggers = $$('[data-lightbox]');
    if (triggers.length === 0) return;
    var box = document.createElement('div');
    box.className = 'image-lightbox';
    box.setAttribute('data-image-lightbox', '');
    box.innerHTML = '<button class="image-lightbox-close" aria-label="Close">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<img alt="" />';
    document.body.appendChild(box);
    var img = box.querySelector('img');

    function open(src) {
      img.src = src;
      box.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }
    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
    triggers.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var src = t.getAttribute('data-lightbox') || (t.querySelector('img') && t.querySelector('img').src);
        if (src) open(src);
      });
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.image-lightbox-close')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', function() {
    initCartDrawer();
    initCartRender();
    initPromoCode();
    initPromoPopup();
    initMobileNav();
    initAddToCartForms();
    initProductGallery();
    initProductOptions();
    initScrollReveal();
    initLightbox();
    Cart.fetch();
  });

  // Expose for debugging
  window.MollyAndSophie = { Cart: Cart };
})();
