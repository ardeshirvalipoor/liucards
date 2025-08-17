async function clearCache() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
        }
    }
}

async function clearServiceWorkers() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }
    }
}

async function clearIndexedDB() {
    if ('indexedDB' in window) {
        const databases = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
        return databases.then(dbList => {
            const deletePromises = dbList.map(db => {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.deleteDatabase(db.name);
                    request.onsuccess = resolve;
                    request.onerror = reject;
                });
            });
            return Promise.all(deletePromises);
        });
    }
    return Promise.resolve();
}

function clearLocalStorage() {
    localStorage.clear();
}

async function clearAllData() {

    try {
        // await clearServiceWorkers();
        // await clearCache();
        // await clearIndexedDB();
        // clearLocalStorage();
    } catch (error) {
        alert('An error occurred while clearing data. Please try again.');
    }
}

// Automatically execute the clearing process upon loading the app
window.onload = clearAllData;
