(function () {
  'use strict';

  var measurementId = 'G-QBDF1CFNJX';
  var consentKey = 'cookie';
  var analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }

  function eraseAnalyticsCookies() {
    window['ga-disable-' + measurementId] = true;
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = name + '=; Max-Age=0; path=/; domain=.odemevent.fr; SameSite=Lax';
      }
    });
  }

  function banner() {
    return document.getElementById('cookieBanner');
  }

  function hideBanner() {
    var node = banner();
    if (!node) return;
    node.classList.remove('show');
    node.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    var node = banner();
    if (!node) return;
    node.classList.add('show');
    node.setAttribute('aria-hidden', 'false');
  }

  window.acceptCookie = function () {
    localStorage.setItem(consentKey, '1');
    hideBanner();
    loadAnalytics();
    updateSettingsButton();
  };

  window.closeCookie = function () {
    localStorage.setItem(consentKey, '0');
    hideBanner();
    eraseAnalyticsCookies();
    updateSettingsButton();
  };

  function createBannerIfNeeded() {
    if (banner()) return;
    var node = document.createElement('div');
    node.id = 'cookieBanner';
    node.className = 'cookie-banner odem-cookie-panel';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-label', 'Choix des cookies');
    node.innerHTML = '<p class="cookie-txt">Nous utilisons Google Analytics pour mesurer les visites et améliorer le site. Le suivi ne démarre qu\u2019avec votre accord. <a href="/politique-confidentialite.html">En savoir plus</a>.</p><div class="cookie-btns"><button class="cookie-btn decline" type="button">Refuser</button><button class="cookie-btn accept" type="button">Accepter</button></div>';
    document.body.appendChild(node);
  }

  function prepareBanner() {
    createBannerIfNeeded();
    var node = banner();
    if (!node) return;
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-label', 'Choix des cookies');

    var text = node.querySelector('.cookie-txt');
    if (text) {
      text.removeAttribute('data-fr');
      text.removeAttribute('data-en');
      text.innerHTML = 'Nous utilisons Google Analytics pour mesurer les visites et améliorer le site. Le suivi ne démarre qu\u2019avec votre accord. <a href="/politique-confidentialite.html">En savoir plus</a>.';
    }

    var accept = node.querySelector('.accept');
    var decline = node.querySelector('.decline');
    if (accept) {
      accept.type = 'button';
      accept.onclick = window.acceptCookie;
    }
    if (decline) {
      decline.type = 'button';
      decline.onclick = window.closeCookie;
    }
  }

  function updateSettingsButton() {
    var button = document.getElementById('odemCookieSettings');
    if (!button) return;
    button.hidden = localStorage.getItem(consentKey) === null;
  }

  function createSettingsButton() {
    var button = document.createElement('button');
    button.id = 'odemCookieSettings';
    button.className = 'odem-cookie-settings';
    button.type = 'button';
    button.textContent = 'Cookies';
    button.setAttribute('aria-label', 'Modifier mes préférences de cookies');
    button.addEventListener('click', showBanner);
    document.body.appendChild(button);
    updateSettingsButton();
  }

  function track(name, parameters) {
    if (localStorage.getItem(consentKey) !== '1' || typeof window.gtag !== 'function') return;
    window.gtag('event', name, parameters || {});
  }

  function enableEventTracking() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      var details = { page_path: location.pathname, link_url: href };
      if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)/i.test(href)) track('contact_whatsapp', details);
      else if (/^tel:/i.test(href)) track('contact_phone', details);
      else if (/^mailto:/i.test(href)) track('contact_email', details);
    });

    document.addEventListener('submit', function (event) {
      var form = event.target;
      track('contact_form_submit', {
        page_path: location.pathname,
        form_id: form.id || form.getAttribute('name') || 'contact'
      });
    });
  }

  function addStyles() {
    var style = document.createElement('style');
    style.textContent = '.odem-cookie-panel{position:fixed;left:0;right:0;bottom:0;z-index:10000;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 2rem;background:#1a1a1a;border-top:1px solid rgba(201,168,76,.35);transform:translateY(110%);transition:transform .35s ease}.odem-cookie-panel.show{transform:translateY(0)}.odem-cookie-panel .cookie-txt{margin:0;max-width:760px;color:rgba(255,255,255,.75);font:400 .72rem/1.6 Montserrat,Arial,sans-serif}.odem-cookie-panel .cookie-txt a{color:#c9a84c}.odem-cookie-panel .cookie-btns{display:flex;gap:.6rem}.odem-cookie-panel .cookie-btn{padding:.62rem 1.1rem;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;cursor:pointer}.odem-cookie-panel .cookie-btn.accept{border-color:#c9a84c;background:#c9a84c;color:#111}.odem-cookie-settings{position:fixed;left:10px;bottom:10px;z-index:9998;padding:.3rem .55rem;border:1px solid rgba(201,168,76,.5);border-radius:3px;background:rgba(20,20,20,.82);color:#ddd;font:500 .58rem Montserrat,Arial,sans-serif;cursor:pointer}@media(max-width:680px){.odem-cookie-panel{align-items:flex-start;flex-direction:column;padding:1rem}.odem-cookie-panel .cookie-btns{width:100%}.odem-cookie-panel .cookie-btn{flex:1}}';
    document.head.appendChild(style);
  }

  addStyles();
  prepareBanner();
  createSettingsButton();
  enableEventTracking();

  var choice = localStorage.getItem(consentKey);
  if (choice === '1') loadAnalytics();
  else if (choice === '0') eraseAnalyticsCookies();
  else window.setTimeout(showBanner, 800);
}());
