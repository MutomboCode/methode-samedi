/* =============================================
   MÉTHODE SAMEDI — main.js
   Navbar mobile + Validação de formulário
   ============================================= */

(function () {
  'use strict';

  /* ===== NAVBAR MOBILE ===== */
  const toggle = document.querySelector('.navbar__toggle');
  const nav    = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('navbar__nav--open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fechar ao clicar num link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fechar com Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    function closeMenu() {
      nav.classList.remove('navbar__nav--open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* ===== FORMULÁRIO DE CONTATO ===== */
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg   = document.getElementById('form-error');

  if (!form) return;

  const submitBtn  = form.querySelector('.contact-form__submit');
  const submitLabel = form.querySelector('.contact-form__submit-label');

  function showFieldError(input, message) {
    const errorEl = document.getElementById(input.id + '-error');
    input.closest('.field').classList.add('field--error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', input.id + '-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  }

  function clearFieldError(input) {
    const errorEl = document.getElementById(input.id + '-error');
    input.closest('.field').classList.remove('field--error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    if (errorEl) errorEl.hidden = true;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateAll() {
    var valid = true;

    var requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function (input) {
      clearFieldError(input);
      if (!input.value.trim()) {
        showFieldError(input, 'Campo obrigatório.');
        valid = false;
      } else if (input.type === 'email' && !isValidEmail(input.value)) {
        showFieldError(input, 'Informe um e-mail válido.');
        valid = false;
      }
    });

    return valid;
  }

  // Validação ao sair do campo (blur)
  form.querySelectorAll('[required]').forEach(function (input) {
    input.addEventListener('blur', function () {
      if (!input.value.trim()) {
        showFieldError(input, 'Campo obrigatório.');
      } else if (input.type === 'email' && !isValidEmail(input.value)) {
        showFieldError(input, 'Informe um e-mail válido.');
      } else {
        clearFieldError(input);
      }
    });

    input.addEventListener('input', function () {
      if (input.value.trim()) clearFieldError(input);
    });
  });

  // Envio
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    successMsg.hidden = true;
    errorMsg.hidden   = true;

    if (!validateAll()) {
      var firstError = form.querySelector('.field--error .field__input');
      if (firstError) firstError.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    if (submitLabel) submitLabel.textContent = 'Enviando…';

    try {
      var response = await fetch(form.action, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    new FormData(form),
      });

      var text = await response.text();
      console.log('Web3Forms status:', response.status, 'body:', text);

      var data = JSON.parse(text);

      if (data.success) {
        form.reset();
        successMsg.hidden = false;
        successMsg.focus?.();
      } else {
        throw new Error(data.message || 'Falha no envio');
      }
    } catch (err) {
      console.error('Erro no envio:', err);
      errorMsg.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      if (submitLabel) submitLabel.textContent = 'Enviar pedido';
    }
  });

})();
