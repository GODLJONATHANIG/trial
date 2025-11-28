const installButton = document.getElementById("installButton");
const yearEl = document.getElementById("year");
let deferredPrompt;

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        installButton.textContent = "Downloads not supported";
        return;
    }

    try {
        await navigator.serviceWorker.register("./sw.js");
        installButton.textContent = "Checking download status…";
    } catch (error) {
        console.error("SW registration failed", error);
        installButton.textContent = "Unable to prepare download";
        installButton.disabled = true;
    }
}

window.addEventListener("load", registerServiceWorker);

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.disabled = false;
    installButton.textContent = "Download app";
});

installButton.addEventListener("click", async () => {
    if (!deferredPrompt) {
        installButton.textContent = "Download not ready";
        return;
    }

    installButton.disabled = true;
    installButton.textContent = "Opening download…";
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
        installButton.textContent = "Thanks for downloading!";
    } else {
        installButton.textContent = "Download app";
        installButton.disabled = false;
    }
    deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
    installButton.textContent = "Already downloaded";
    installButton.disabled = true;
});

