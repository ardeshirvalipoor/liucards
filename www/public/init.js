let newWorker

// The click event on the notification

if ("serviceWorker" in navigator) {
    // Register the service worker
    navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
            reg.addEventListener("updatefound", () => {
                console.log("updatefound")
                // An updated service worker has appeared in reg.installing!
                newWorker = reg.installing

                newWorker.addEventListener("statechange", () => {
                    console.log("state changes")
                    // Has service worker state changed?
                    switch (newWorker.state) {
                        case "installed":
                            // There is a new service worker available, show the notification
                            if (navigator.serviceWorker.controller) {
                                // let notification = document.getElementById('notification')
                                // notification.style.display = 'flex'
                            }
                            break
                    }
                })
            })
        })
    let refreshing
    // The event listener that is fired when the service worker updates
    // Here we reload the page
    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function () {
            if (refreshing) return
            // document.getElementById('reload').addEventListener('click', function () {
            newWorker.postMessage({ action: "skipWaiting" })
            window.location.reload()
            refreshing = true
            // })
        }
    )
}