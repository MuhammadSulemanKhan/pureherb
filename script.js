const qtyInput = document.getElementById('qtyInput');
const minusBtn = document.getElementById('minusBtn');
const plusBtn = document.getElementById('plusBtn');
const gallerySlides = document.querySelectorAll('.gallery-slide');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');
const codOpenBtn = document.getElementById('codOpenBtn');
const orderNowMobileBtn = document.getElementById('orderNowMobileBtn');
const codModal = document.getElementById('codModal');
const codCloseBtn = document.getElementById('codCloseBtn');
const modalMinusBtn = document.getElementById('modalMinusBtn');
const modalPlusBtn = document.getElementById('modalPlusBtn');
const modalQty = document.getElementById('modalQty');
const codSubtotal = document.getElementById('codSubtotal');
const codTotal = document.getElementById('codTotal');
const completeOrderBtn = document.getElementById('completeOrderBtn');
const shippingForm = document.getElementById('shippingForm');
const easyOrderForm = document.getElementById('easyOrderForm');
const easySubmitBtn = document.getElementById('easySubmitBtn');
const orderSuccessModal = document.getElementById('orderSuccessModal');
const successCloseBtn = document.getElementById('successCloseBtn');
const successCloseTriggers = document.querySelectorAll('[data-close-success-modal]');
const closeModalTriggers = document.querySelectorAll('[data-close-modal]');
const watcherCountEl = document.getElementById('watcherCount');
const offerDaysEl = document.getElementById('offerDays');
const offerHoursEl = document.getElementById('offerHours');
const offerMinutesEl = document.getElementById('offerMinutes');
const offerSecondsEl = document.getElementById('offerSeconds');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const eidNoticeModal = document.getElementById('eidNoticeModal');
const eidNoticeCloseBtn = document.getElementById('eidNoticeCloseBtn');
const eidNoticeCloseTriggers = document.querySelectorAll('[data-close-eid-notice]');
const feedbackReviewBtn = document.getElementById('feedbackReviewBtn');
const feedbackFormModal = document.getElementById('feedbackFormModal');
const feedbackFormCloseBtn = document.getElementById('feedbackFormCloseBtn');
const feedbackFormCloseTriggers = document.querySelectorAll('[data-close-feedback-form]');
const feedbackForm = document.getElementById('feedbackForm');
const webAppUrl = 'https://script.google.com/macros/s/AKfycbz72gPFpZKz_2n1_ONHelgCMPqSlxEWG7aIFexcqy8aYxgq5Al8FvNWdtQ1VsA-ZPIbTw/exec';

let watcherCount = 150;
let currentQty = 1;
let currentGalleryIndex = 0;
let galleryTimerId;
let shippingFormSubmitted = false;
let easyFormSubmitted = false;
let eidNoticeAutoCloseTimerId;

const unitPrice = 1999;

function formatPKR(value) {
  return `Rs.${value.toLocaleString('en-PK')}.00`;
}

function getCurrentQty() {
  if (!qtyInput) return currentQty;
  const value = Number(qtyInput.value);
  if (Number.isNaN(value) || value < 1) return 1;
  return value;
}

function updateOrderSummary(quantity) {
  const subtotal = quantity * unitPrice;
  const priceText = formatPKR(subtotal);

  if (modalQty) modalQty.textContent = String(quantity);
  if (codSubtotal) codSubtotal.textContent = priceText;
  if (codTotal) codTotal.textContent = priceText;
}

// function setQuantity(quantity) {
//   const safeQuantity = Math.max(1, quantity);
//   currentQty = safeQuantity;
//   if (qtyInput) {
//     qtyInput.value = String(safeQuantity);
//   }
//   updateOrderSummary(safeQuantity);
// }


function setQuantity(quantity) {
  const safeQuantity = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));

  currentQty = safeQuantity;

  if (qtyInput) {
    qtyInput.value = String(safeQuantity);
  }

  updateOrderSummary(safeQuantity);
}

if (qtyInput) {
  qtyInput.addEventListener('change', () => {
    setQuantity(qtyInput.value);
  });
}


function renderWatcherCount() {
  if (!watcherCountEl) return;

  watcherCountEl.textContent = String(watcherCount);
  watcherCountEl.classList.remove('bump');
  void watcherCountEl.offsetWidth;
  watcherCountEl.classList.add('bump');
}

function startWatcherCounter() {
  if (!watcherCountEl) return;

  renderWatcherCount();
  window.setInterval(() => {
    const increments = [1, 2, 3, 4];
    const increment = increments[Math.floor(Math.random() * increments.length)];
    watcherCount += increment;
    renderWatcherCount();
  }, 5000);
}

function formatTwoDigits(value) {
  return String(value).padStart(2, '0');
}

function startOfferCountdown() {
  if (!offerDaysEl || !offerHoursEl || !offerMinutesEl || !offerSecondsEl) return;

  const offerDurationMs = (((1 * 24 + 1) * 60 + 54) * 60 + 18) * 1000;
  const offerEndTime = Date.now() + offerDurationMs;

  const renderCountdown = () => {
    const remainingMs = Math.max(0, offerEndTime - Date.now());
    const remainingSecondsTotal = Math.floor(remainingMs / 1000);

    const days = Math.floor(remainingSecondsTotal / (24 * 60 * 60));
    const hours = Math.floor((remainingSecondsTotal % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remainingSecondsTotal % (60 * 60)) / 60);
    const seconds = remainingSecondsTotal % 60;

    offerDaysEl.textContent = formatTwoDigits(days);
    offerHoursEl.textContent = formatTwoDigits(hours);
    offerMinutesEl.textContent = formatTwoDigits(minutes);
    offerSecondsEl.textContent = formatTwoDigits(seconds);

    if (remainingMs <= 0) {
      window.clearInterval(timerId);
    }
  };

  renderCountdown();
  const timerId = window.setInterval(renderCountdown, 1000);
}

if (minusBtn) {
  minusBtn.addEventListener('click', () => {
    setQuantity(getCurrentQty() - 1);
  });
}

if (plusBtn) {
  plusBtn.addEventListener('click', () => {
    setQuantity(getCurrentQty() + 1);
  });
}

function showGallerySlide(index) {
  if (!gallerySlides.length) return;

  const safeIndex = (index + gallerySlides.length) % gallerySlides.length;
  gallerySlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === safeIndex);
  });
  currentGalleryIndex = safeIndex;
}

function moveGallerySlide(step) {
  showGallerySlide(currentGalleryIndex + step);
}

function startGalleryAutoSlide() {
  if (galleryTimerId || gallerySlides.length < 2) return;
  galleryTimerId = window.setInterval(() => {
    moveGallerySlide(1);
  }, 3000);
}

function resetGalleryAutoSlide() {
  if (galleryTimerId) {
    window.clearInterval(galleryTimerId);
    galleryTimerId = undefined;
  }
  startGalleryAutoSlide();
}

let activeReviewPlayback = null;

function resetReviewPlaybackState() {
  if (!activeReviewPlayback) return;

  const { audio, button, statusEl, labelEl, card } = activeReviewPlayback;
  
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (button) {
    button.setAttribute('aria-pressed', 'false');
  }
  if (labelEl) {
    labelEl.textContent = 'Play Voice Note';
  }
  if (statusEl) {
    statusEl.textContent = 'Ready to play';
  }
  if (card) {
    card.classList.remove('is-playing');
  }

  activeReviewPlayback = null;
}

function playReviewVoice(button) {
  const card = button.closest('.voice-review-card');
  const audioEl = card ? card.querySelector('.voice-review-audio') : null;
  const statusEl = card ? card.querySelector('[data-review-status]') : null;
  const labelEl = button.querySelector('[data-review-button-label]');
  const audioSrc = audioEl ? audioEl.dataset.audioSrc : '';

  if (!audioSrc) return;

  // If already playing this one, stop it
  if (activeReviewPlayback && activeReviewPlayback.button === button) {
    resetReviewPlaybackState();
    return;
  }

  // Stop any other playing audio
  if (activeReviewPlayback) {
    resetReviewPlaybackState();
  }

  // Set up the audio element
  if (!audioEl.src) {
    audioEl.src = audioSrc;
  }

  activeReviewPlayback = {
    audio: audioEl,
    button,
    card,
    statusEl,
    labelEl,
  };

  button.setAttribute('aria-pressed', 'true');
  if (labelEl) {
    labelEl.textContent = 'Stop Voice Note';
  }
  if (statusEl) {
    statusEl.textContent = 'Playing voice note...';
  }
  if (card) {
    card.classList.add('is-playing');
  }

  audioEl.onended = () => {
    if (activeReviewPlayback && activeReviewPlayback.button === button) {
      resetReviewPlaybackState();
    }
  };

  audioEl.onerror = () => {
    if (activeReviewPlayback && activeReviewPlayback.button === button) {
      if (statusEl) {
        statusEl.textContent = 'Error loading audio';
      }
      resetReviewPlaybackState();
    }
  };

  audioEl.play().catch((err) => {
    if (statusEl) {
      statusEl.textContent = 'Error playing audio';
    }
    resetReviewPlaybackState();
  });
}

document.querySelectorAll('[data-review-play]').forEach((button) => {
  button.addEventListener('click', () => {
    playReviewVoice(button);
  });
});

// Bakra Eid Offer Button
const eidOfferBtn = document.getElementById('eidOfferBtn');
if (eidOfferBtn) {
  eidOfferBtn.addEventListener('click', () => {
    scrollToEasyOrderForm();
  });
}

if (gallerySlides.length) {
  showGallerySlide(0);
  startGalleryAutoSlide();
}

if (galleryPrevBtn) {
  galleryPrevBtn.addEventListener('click', () => {
    moveGallerySlide(-1);
    resetGalleryAutoSlide();
  });
}

if (galleryNextBtn) {
  galleryNextBtn.addEventListener('click', () => {
    moveGallerySlide(1);
    resetGalleryAutoSlide();
  });
}

function openCodModal() {
  if (!codModal) return;

  // Prevent reopening if order already submitted
  if (shippingFormSubmitted) {
    showSidePopup('آپ پہلے سے آرڈر دے چکے ہیں ✓ شکریہ!', 'success');
    return;
  }

  codModal.hidden = false;
  document.body.classList.add('cod-open');
  document.body.classList.add('no-scroll');
  updateOrderSummary(getCurrentQty());
}

function closeCodModal() {
  if (!codModal) return;
  codModal.hidden = true;
  document.body.classList.remove('cod-open');

  if (!orderSuccessModal || orderSuccessModal.hidden) {
    document.body.classList.remove('no-scroll');
  }
}

function openEidNoticeModal(autoCloseMs = 0) {
  if (!eidNoticeModal) return;
  eidNoticeModal.hidden = false;
  document.body.classList.add('no-scroll');

  if (eidNoticeAutoCloseTimerId) {
    window.clearTimeout(eidNoticeAutoCloseTimerId);
    eidNoticeAutoCloseTimerId = undefined;
  }

  if (autoCloseMs > 0) {
    eidNoticeAutoCloseTimerId = window.setTimeout(() => {
      closeEidNoticeModal();
    }, autoCloseMs);
  }
}

function closeEidNoticeModal() {
  if (!eidNoticeModal) return;
  eidNoticeModal.hidden = true;

  if (eidNoticeAutoCloseTimerId) {
    window.clearTimeout(eidNoticeAutoCloseTimerId);
    eidNoticeAutoCloseTimerId = undefined;
  }

  const shouldKeepNoScroll = (codModal && !codModal.hidden)
    || (orderSuccessModal && !orderSuccessModal.hidden)
    || (mainNav && mainNav.classList.contains('active'));

  if (!shouldKeepNoScroll) {
    document.body.classList.remove('no-scroll');
  }
}

function openFeedbackFormModal() {
  if (!feedbackFormModal) return;
  feedbackFormModal.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeFeedbackFormModal() {
  if (!feedbackFormModal) return;
  feedbackFormModal.hidden = true;

  const shouldKeepNoScroll = (codModal && !codModal.hidden)
    || (orderSuccessModal && !orderSuccessModal.hidden)
    || (eidNoticeModal && !eidNoticeModal.hidden)
    || (mainNav && mainNav.classList.contains('active'));

  if (!shouldKeepNoScroll) {
    document.body.classList.remove('no-scroll');
  }
}

function openSuccessModal() {
  if (!orderSuccessModal) return;
  orderSuccessModal.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeSuccessModal() {
  if (!orderSuccessModal) return;
  orderSuccessModal.hidden = true;

  if (!codModal || codModal.hidden) {
    document.body.classList.remove('no-scroll');
  }

  // Prevent form reopening after successful submission
  if (shippingFormSubmitted) {
    if (codModal) {
      codModal.hidden = true;
    }
  }
}

if (codOpenBtn) {
  codOpenBtn.addEventListener('click', openCodModal);
}

function scrollToEasyOrderForm() {
  if (!easyOrderForm) return;

  // Prevent scrolling to form if order already submitted
  if (easyFormSubmitted) {
    showSidePopup('آپ پہلے سے آرڈر دے چکے ہیں ✓ شکریہ!', 'success');
    return;
  }

  const formCard = easyOrderForm.closest('.easy-order-card') || easyOrderForm;
  const targetTop = formCard.getBoundingClientRect().top + window.scrollY - 12;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth',
  });
}

if (orderNowMobileBtn) {
  orderNowMobileBtn.addEventListener('click', scrollToEasyOrderForm);
}

if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', (event) => {
    event.preventDefault();
    openEidNoticeModal();
  });
}

if (eidNoticeModal) {
  openEidNoticeModal(5000);
}

if (feedbackReviewBtn) {
  feedbackReviewBtn.addEventListener('click', openFeedbackFormModal);
}

if (feedbackFormCloseBtn) {
  feedbackFormCloseBtn.addEventListener('click', closeFeedbackFormModal);
}

feedbackFormCloseTriggers.forEach((trigger) => {
  trigger.addEventListener('click', closeFeedbackFormModal);
});

if (feedbackForm) {
  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (typeof showSidePopup === 'function') {
      showSidePopup('Shukriya! Aap ka review form mein receive ho gaya ✅', 'success');
    }
    feedbackForm.reset();
    closeFeedbackFormModal();
  });
}

if (eidNoticeCloseBtn) {
  eidNoticeCloseBtn.addEventListener('click', closeEidNoticeModal);
}

eidNoticeCloseTriggers.forEach((trigger) => {
  trigger.addEventListener('click', closeEidNoticeModal);
});

if (codCloseBtn) {
  codCloseBtn.addEventListener('click', closeCodModal);
}

function openMobileMenu() {
  if (!mainNav || !menuToggle) return;
  mainNav.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.textContent = '✕';
  if (mobileMenuOverlay) {
    mobileMenuOverlay.hidden = false;
    mobileMenuOverlay.classList.add('active');
  }
  document.body.classList.add('no-scroll');
}

function closeMobileMenu() {
  if (!mainNav || !menuToggle) return;
  mainNav.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
  if (mobileMenuOverlay) {
    mobileMenuOverlay.classList.remove('active');
    mobileMenuOverlay.hidden = true;
  }

  if (!codModal || codModal.hidden) {
    document.body.classList.remove('no-scroll');
  }
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

closeModalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', closeCodModal);
});

if (modalMinusBtn) {
  modalMinusBtn.addEventListener('click', () => {
    setQuantity(getCurrentQty() - 1);
  });
}

if (modalPlusBtn) {
  modalPlusBtn.addEventListener('click', () => {
    setQuantity(getCurrentQty() + 1);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && feedbackFormModal && !feedbackFormModal.hidden) {
    closeFeedbackFormModal();
    return;
  }

  if (event.key === 'Escape' && eidNoticeModal && !eidNoticeModal.hidden) {
    closeEidNoticeModal();
    return;
  }

  if (event.key === 'Escape' && orderSuccessModal && !orderSuccessModal.hidden) {
    closeSuccessModal();
    return;
  }

  if (event.key === 'Escape' && codModal && !codModal.hidden) {
    closeCodModal();
    return;
  }

  if (event.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
    closeMobileMenu();
  }
});

function normalizePhone(rawPhone) {
  return rawPhone.replace(/[\s()-]/g, '').trim();
}

function isValidPakistanMobile(rawPhone) {
  const normalized = normalizePhone(rawPhone);
  const nationalNumber = normalized
    .replace(/^\+92/, '')
    .replace(/^92/, '')
    .replace(/^0/, '');

  return /^3\d{9}$/.test(nationalNumber);
}

function validateFormData(firstName, phone, address, city) {
  if (firstName.length < 2 || !/^[\p{L}\s]+$/u.test(firstName)) {
    return 'First name sahi likhein (sirf letters, minimum 2 characters).';
  }

  if (!isValidPakistanMobile(phone)) {
    return 'Phone number sahi likhein (03XXXXXXXXX ya +923XXXXXXXXX).';
  }

  if (address.length < 6) {
    return 'Address minimum 6 characters hona chahiye.';
  }

  if (city.length < 2 || !/^[\p{L}\s]+$/u.test(city)) {
    return 'City ka naam sahi likhein (sirf letters).';
  }

  return '';
}

function getShippingFormValues() {
  const firstNameInput = document.getElementById('fullNameInput');
  const phoneInput = document.getElementById('phoneInput');
  const addressInput = document.getElementById('addressInput');
  const cityInput = document.getElementById('cityInput');

  return {
    firstNameInput,
    phoneInput,
    addressInput,
    cityInput,
    firstName: firstNameInput ? firstNameInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    address: addressInput ? addressInput.value.trim() : '',
    city: cityInput ? cityInput.value.trim() : '',
  };
}

function getEasyFormValues() {
  const firstNameInput = document.getElementById('easyFullNameInput');
  const phoneInput = document.getElementById('easyPhoneInput');
  const addressInput = document.getElementById('easyAddressInput');
  const cityInput = document.getElementById('easyCityInput');

  return {
    firstNameInput,
    phoneInput,
    addressInput,
    cityInput,
    firstName: firstNameInput ? firstNameInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    address: addressInput ? addressInput.value.trim() : '',
    city: cityInput ? cityInput.value.trim() : '',
  };
}

function canShowSuccessPopup(formValues) {
  const { firstName, phone, address, city } = formValues;
  const hasAllFields = [firstName, phone, address, city].every((value) => value.trim().length > 0);
  if (!hasAllFields) return false;

  return validateFormData(firstName, phone, address, city) === '';
}

function updateSubmitButtonState() {
  if (!completeOrderBtn) return;

  const { firstName, phone, address, city } = getShippingFormValues();
  const isFormValid = validateFormData(firstName, phone, address, city) === '';
  completeOrderBtn.disabled = !isFormValid;
}

function updateEasySubmitButtonState() {
  if (!easySubmitBtn) return;

  const { firstName, phone, address, city } = getEasyFormValues();
  const isFormValid = validateFormData(firstName, phone, address, city) === '';
  easySubmitBtn.disabled = !isFormValid;
}

let toastTimerId;

function showSidePopup(message, type = 'info', duration = 5000, isLoading = false) {
  let container = document.getElementById('sideToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sideToastContainer';
    container.className = 'side-toast-container';
    document.body.appendChild(container);
  }

  container.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `side-toast side-toast-${type}`;

  if (isLoading) {
    toast.classList.add('side-toast-loading');
    const spinner = document.createElement('span');
    spinner.className = 'side-toast-spinner';
    spinner.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'side-toast-text';
    text.textContent = message;

    toast.appendChild(spinner);
    toast.appendChild(text);
  } else {
    toast.textContent = message;
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
  }

  if (duration > 0) {
    toastTimerId = window.setTimeout(() => {
      toast.classList.remove('show');
      window.setTimeout(() => {
        if (container) {
          container.innerHTML = '';
        }
      }, 320);
    }, duration);
  }
}

function jsonpPost(payload, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const uniqueId = 'gs_cb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const callbackName = uniqueId;
      const query = payload.toString();
      const src = webAppUrl + '?' + query + '&callback=' + callbackName;

      const timer = window.setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timed out'));
      }, timeoutMs);

      function cleanup() {
        window.clearTimeout(timer);
        try {
          delete window[callbackName];
        } catch (e) {
          window[callbackName] = undefined;
        }
        const s = document.getElementById(callbackName + '_script');
        if (s && s.parentNode) s.parentNode.removeChild(s);
      }

      window[callbackName] = function(res) {
        cleanup();
        if (res && res.status === 'success') return resolve(res);
        return reject(new Error(res && res.message ? res.message : 'JSONP: server error'));
      };

      const script = document.createElement('script');
      script.id = callbackName + '_script';
      script.src = src;
      script.onerror = function() {
        cleanup();
        reject(new Error('JSONP script load error'));
      };
      document.body.appendChild(script);
    } catch (err) {
      reject(err);
    }
  });
}

async function postFormToAppsScript(payload) {
  // Try regular fetch first; if it fails (CORS/file://) fall back to JSONP GET.
  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: payload.toString(),
    });

    const responseText = await response.text();
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Google Sheet response invalid.');
    }

    if (!response.ok) {
      throw new Error(responseData?.message || `Server error (${response.status})`);
    }

    if (!responseData || responseData.status !== 'success') {
      throw new Error(responseData?.message || 'Data Google Sheet mein save nahi hui.');
    }

    return responseData;
  } catch (err) {
    // If fetch fails (likely CORS or origin=file://), try JSONP fallback (GET)
    try {
      return await jsonpPost(payload);
    } catch (jsonpErr) {
      // Prefer original error message if it's more descriptive
      throw err instanceof Error && err.message ? err : jsonpErr;
    }
  }
}

function submitForm(event) {
  event.preventDefault();

  // Prevent duplicate submissions
  if (shippingFormSubmitted) {
    showSidePopup('آپ پہلے سے آرڈر کر چکے ہیں 🙏', 'info');
    return;
  }

  const formValues = getShippingFormValues();
  const { firstName, phone, address, city } = formValues;

  const validationError = validateFormData(firstName, phone, address, city);
  if (validationError) {
    updateSubmitButtonState();
    showSidePopup(validationError, 'error');
    return;
  }

  const payload = new URLSearchParams({
    firstName,
    phone: normalizePhone(phone),
    address,
    city,
    quantity: String(getCurrentQty()),
  });

  if (completeOrderBtn) {
    completeOrderBtn.classList.add('is-processing');
    completeOrderBtn.textContent = 'Processing...';
    completeOrderBtn.disabled = true;
  }

  postFormToAppsScript(payload)
    .then((responseData) => {
      console.log('✅ Apps Script success:', responseData);

      if (!canShowSuccessPopup(formValues)) {
        throw new Error('Form data invalid after submit.');
      }

      // Mark form as submitted
      shippingFormSubmitted = true;

      if (shippingForm) {
        shippingForm.reset();
        // Disable all form inputs
        shippingForm.querySelectorAll('input, textarea, select').forEach((field) => {
          field.disabled = true;
        });
      }

      // Disable complete order button
      if (completeOrderBtn) {
        completeOrderBtn.disabled = true;
        completeOrderBtn.textContent = 'Order Submitted ✓';
      }

      updateSubmitButtonState();
      closeCodModal();
      openSuccessModal();
    })
    .catch((err) => {
      console.error('❌ Submit failed:', err);
      showSidePopup(err.message || 'Google Sheet mein save nahi hua ❌', 'error');
    })
    .finally(() => {
      if (completeOrderBtn && !shippingFormSubmitted) {
        completeOrderBtn.classList.remove('is-processing');
        completeOrderBtn.textContent = 'Place Order';
        updateSubmitButtonState();
      }
    });
}

function submitEasyForm(event) {
  event.preventDefault();

  // Prevent duplicate submissions
  if (easyFormSubmitted) {
    showSidePopup('آپ پہلے سے آرڈر کر چکے ہیں 🙏', 'info');
    return;
  }

  const formValues = getEasyFormValues();
  const { firstName, phone, address, city } = formValues;

  const validationError = validateFormData(firstName, phone, address, city);
  if (validationError) {
    updateEasySubmitButtonState();
    showSidePopup(validationError, 'error');
    return;
  }

  const normalizedPhone = normalizePhone(phone);
  const payload = new URLSearchParams({
    firstName,
    phone: normalizedPhone,
    address,
    city,
    quantity: String(getCurrentQty()),
  });

  console.log('📤 Sending to Apps Script:', {
    firstName,
    phone: normalizedPhone,
    address,
    city,
    payloadString: payload.toString(),
    webAppUrl,
  });

  if (easySubmitBtn) {
    easySubmitBtn.textContent = 'Submitting wait..';
    easySubmitBtn.disabled = true;
  }

  postFormToAppsScript(payload)
    .then((responseData) => {
      console.log('✅ Apps Script success:', responseData);

      if (!canShowSuccessPopup(formValues)) {
        throw new Error('Form data invalid after submit.');
      }

      // Mark form as submitted
      easyFormSubmitted = true;

      if (easyOrderForm) {
        easyOrderForm.reset();
        // Disable all form inputs
        easyOrderForm.querySelectorAll('input, textarea, select').forEach((field) => {
          field.disabled = true;
        });
      }

      // Disable easy submit button
      if (easySubmitBtn) {
        easySubmitBtn.disabled = true;
        easySubmitBtn.textContent = 'Order Submitted ✓';
      }

      updateEasySubmitButtonState();
      openSuccessModal();
    })
    .catch((err) => {
      console.error('❌ Submit failed:', err);
      showSidePopup(err.message || 'Google Sheet mein save nahi hua ❌', 'error');
    })
    .finally(() => {
      if (easySubmitBtn && !easyFormSubmitted) {
        easySubmitBtn.textContent = 'Submit Order';
        updateEasySubmitButtonState();
      }
    });
}

if (shippingForm) {
  shippingForm.addEventListener('submit', submitForm);
  shippingForm.addEventListener('input', updateSubmitButtonState);
  shippingForm.addEventListener('change', updateSubmitButtonState);
}

if (easyOrderForm) {
  easyOrderForm.addEventListener('submit', submitEasyForm);
  easyOrderForm.addEventListener('input', updateEasySubmitButtonState);
  easyOrderForm.addEventListener('change', updateEasySubmitButtonState);
}

if (successCloseBtn) {
  successCloseBtn.addEventListener('click', closeSuccessModal);
}

successCloseTriggers.forEach((trigger) => {
  trigger.addEventListener('click', closeSuccessModal);
});

updateSubmitButtonState();
updateEasySubmitButtonState();

updateOrderSummary(getCurrentQty());
startWatcherCounter();
startOfferCountdown();

const fallbackSvg = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'>
    <rect width='100%' height='100%' fill='#d7d8e1'/>
    <text x='50%' y='46%' text-anchor='middle' fill='#555f8c' font-size='54' font-family='Poppins, Arial'>Image Missing</text>
    <text x='50%' y='53%' text-anchor='middle' fill='#555f8c' font-size='34' font-family='Poppins, Arial'>images folder mein images add karein</text>
  </svg>
`);
const fallbackDataUrl = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;

const imageEls = document.querySelectorAll('img');
imageEls.forEach((img) => {
  img.addEventListener('error', () => {
    img.src = fallbackDataUrl;
  });
});

/* 14 August Azadi floating particles + flags */
(function initAzadiParticles() {
  const layer = document.getElementById('azadiParticles');
  if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const symbols = ['★', '☪', '✦', '🇵🇰'];
  const count = window.innerWidth < 680 ? 6 : 12;
  const flagCount = window.innerWidth < 680 ? 0 : 6;

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    const symbol = symbols[i % symbols.length];
    particle.className = `azadi-particle${symbol === '★' || symbol === '✦' ? ' is-star' : ''}`;
    particle.textContent = symbol;
    particle.style.left = `${Math.random() * 94 + 3}%`;
    particle.style.fontSize = `${12 + Math.random() * 14}px`;
    particle.style.animationDuration = `${5 + Math.random() * 7}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    layer.appendChild(particle);
  }

  for (let i = 0; i < flagCount; i += 1) {
    const flag = document.createElement('span');
    flag.className = 'pk-flag pk-flag--float';
    flag.setAttribute('aria-hidden', 'true');
    flag.innerHTML = `
      <span class="pk-flag__cloth">
        <span class="pk-flag__white"></span>
        <span class="pk-flag__green">
          <span class="pk-flag__crescent"></span>
          <span class="pk-flag__star">★</span>
        </span>
      </span>
    `;
    flag.style.left = `${8 + Math.random() * 84}%`;
    flag.style.animationDuration = `${7 + Math.random() * 6}s`;
    flag.style.animationDelay = `${Math.random() * 4}s`;
    layer.appendChild(flag);
  }
})();

(function initTrustCertificationsSlider() {
  const slider = document.getElementById('trustCertificationsSlider');
  const track = document.getElementById('trustCertificationsTrack');
  const dotsWrap = document.getElementById('trustCertificationsDots');
  if (!slider || !track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll('.trust-slide'));
  const prevBtn = slider.querySelector('.trust-slider-prev');
  const nextBtn = slider.querySelector('.trust-slider-next');
  const mobileQuery = window.matchMedia('(max-width: 640px)');
  let index = 0;
  let timerId;

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'trust-slider-dot';
    dot.setAttribute('aria-label', `Show certifications slide ${slideIndex + 1}`);
    dot.addEventListener('click', () => goTo(slideIndex, true));
    dotsWrap.appendChild(dot);
  });

  function goTo(nextIndex, restartTimer) {
    if (!slides.length) return;
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = mobileQuery.matches ? `translateX(-${index * 100}%)` : '';
    dotsWrap.querySelectorAll('.trust-slider-dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
    if (restartTimer) startAuto();
  }

  function startAuto() {
    stopAuto();
    if (!mobileQuery.matches || slides.length < 2) return;
    timerId = window.setInterval(() => goTo(index + 1), 3200);
  }

  function stopAuto() {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = undefined;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1, true));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1, true));

  slider.addEventListener('pointerenter', stopAuto);
  slider.addEventListener('pointerleave', startAuto);

  let touchStartX = 0;
  slider.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  slider.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 40) {
      goTo(index + (distance < 0 ? 1 : -1), true);
    } else {
      startAuto();
    }
  }, { passive: true });

  mobileQuery.addEventListener('change', () => {
    goTo(mobileQuery.matches ? index : 0);
    startAuto();
  });

  goTo(0);
  startAuto();
})();

(function initScrollOfferPopup() {
  const popup = document.getElementById('scrollOfferPopup');
  if (!popup) return;

  const closeBtn = popup.querySelector('.scroll-offer-close');
  const orderBtn = popup.querySelector('.scroll-offer-cta');
  const storageKey = 'promanScrollOfferClosed';
  let dismissed = false;
  let hideTimerId;

  try {
    dismissed = window.sessionStorage.getItem(storageKey) === '1';
  } catch (error) {
    dismissed = false;
  }

  function hidePopup(persist) {
    dismissed = true;
    popup.classList.remove('is-visible');
    if (hideTimerId) {
      window.clearTimeout(hideTimerId);
      hideTimerId = undefined;
    }
    if (!persist) return;
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch (error) {
      /* ignore storage errors */
    }
  }

  function startAutoHide() {
    if (hideTimerId) return;
    hideTimerId = window.setTimeout(() => {
      hidePopup(false);
    }, 5000);
  }

  function updatePopup() {
    if (dismissed) {
      popup.classList.remove('is-visible');
      return;
    }

    const shouldShow = window.scrollY > 160;
    popup.classList.toggle('is-visible', shouldShow);
    if (shouldShow) startAutoHide();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hidePopup(true);
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      if (typeof scrollToEasyOrderForm === 'function') {
        scrollToEasyOrderForm();
      }
    });
  }

  window.addEventListener('scroll', updatePopup, { passive: true });
  updatePopup();
})();
