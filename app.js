const installButton = document.getElementById("installButton");
const yearEl = document.getElementById("year");
let deferredPrompt;

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        installButton.textContent = "Service workers not supported";
        return;
    }

    try {
        await navigator.serviceWorker.register("/sw.js");
        installButton.textContent = "Checking install status…";
    } catch (error) {
        console.error("SW registration failed", error);
        installButton.textContent = "Unable to register offline support";
        installButton.disabled = true;
    }
}

window.addEventListener("load", registerServiceWorker);

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.disabled = false;
    installButton.textContent = "Install nextwave";
});

installButton.addEventListener("click", async () => {
    if (!deferredPrompt) {
        installButton.textContent = "Install prompt not ready";
        return;
    }

    installButton.disabled = true;
    installButton.textContent = "Opening prompt…";
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
        installButton.textContent = "Thanks for installing!";
    } else {
        installButton.textContent = "Install nextwave";
        installButton.disabled = false;
    }
    deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
    installButton.textContent = "Already installed";
    installButton.disabled = true;
});

