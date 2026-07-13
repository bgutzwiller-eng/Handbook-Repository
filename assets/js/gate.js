(function () {
  'use strict';

  var gate = document.querySelector('[data-gate]');
  if (!gate) return;

  var storageKey = gate.getAttribute('data-gate-key') || 'mbli-gate-unlocked';
  var passcodeHash = gate.getAttribute('data-gate-hash');
  var form = gate.querySelector('[data-gate-form]');
  var input = gate.querySelector('[data-gate-input]');
  var error = gate.querySelector('[data-gate-error]');
  var body = document.body;

  function unlock() {
    body.classList.remove('is-gated');
    body.classList.add('is-unlocked');
    gate.setAttribute('hidden', '');
    var main = document.getElementById('main-content');
    if (main) main.focus({ preventScroll: true });
  }

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map
        .call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  if (window.sessionStorage && sessionStorage.getItem(storageKey) === '1') {
    unlock();
    return;
  }

  body.classList.add('is-gated');

  if (!window.crypto || !window.crypto.subtle) {
    if (error) {
      error.textContent = 'This browser cannot verify the passcode securely. Please use an updated browser.';
      error.hidden = false;
    }
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = (input.value || '').trim();
    if (!value) return;
    sha256Hex(value).then(function (hex) {
      if (hex === passcodeHash) {
        if (window.sessionStorage) sessionStorage.setItem(storageKey, '1');
        if (error) error.hidden = true;
        unlock();
      } else {
        if (error) {
          error.textContent = 'Incorrect passcode. Please try again.';
          error.hidden = false;
        }
        input.value = '';
        input.focus();
      }
    });
  });
})();
