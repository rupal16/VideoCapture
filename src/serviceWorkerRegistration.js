export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").then((res) => {
        console.log("Registered successfully");
      });
    });
  }
}
