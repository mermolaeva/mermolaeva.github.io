(() => {
  "use strict";

  const trackingId = document.currentScript && document.currentScript.dataset.trackingId;
  if (!trackingId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", trackingId, { anonymize_ip: false });
})();
