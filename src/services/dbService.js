const DB_NAME = 'leetcode_tracker';
const DB_VERSION = 1;
const STORE_NAME = 'problem_progress';

let db = null;

export const initDB = () => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            db = event.target.result;

            // Handle connection closing
            db.onclose = () => {
                db = null;
            };

            // Handle version change
            db.onversionchange = () => {
                db.close();
                db = null;
            };

            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

export const saveProgress = async (category, problems) => {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const progress = {
                id: category,
                problems: problems
            };

            const request = store.put(progress);

            request.onerror = () => {
                reject('Error saving progress');
            };

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = (event) => {
                console.error('Transaction error:', event.target.error);
                reject('Transaction error');
            };
        });
    } catch (error) {
        console.error('Save progress error:', error);
        throw error;
    }
};

export const getProgress = async (category) => {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(category);

            request.onerror = (event) => {
                console.error('Get progress error:', event.target.error);
                reject('Error getting progress');
            };

            request.onsuccess = () => {
                resolve(request.result?.problems || []);
            };

            transaction.onerror = (event) => {
                console.error('Transaction error:', event.target.error);
                reject('Transaction error');
            };
        });
    } catch (error) {
        console.error('Get progress error:', error);
        throw error;
    }
};

export const getAllProgress = async () => {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = (event) => {
                console.error('Get all progress error:', event.target.error);
                reject('Error getting all progress');
            };

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            transaction.onerror = (event) => {
                console.error('Transaction error:', event.target.error);
                reject('Transaction error');
            };
        });
    } catch (error) {
        console.error('Get all progress error:', error);
        throw error;
    }
}; 