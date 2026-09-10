const updateThemeColour = () => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.content = document.documentElement.dataset.theme === "dark" ? "#071722" : "#0b2234";
};

updateThemeColour();
new MutationObserver(updateThemeColour).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

if (
  "serviceWorker" in navigator
  && window.isSecureContext
  && !["localhost", "127.0.0.1"].includes(window.location.hostname)
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // Installation is an enhancement; the live site stays fully usable.
    });
  }, { once: true });
}

// Development must show the files currently being edited. Existing local
// preview registrations from older releases are retired without touching prod.
if ("serviceWorker" in navigator && ["localhost","127.0.0.1"].includes(location.hostname)) {
  navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(registration => registration.unregister()));
}
