let cachedWords: any[] = [];
let lastLoadTime = 0;

export async function loadWords() {
  // 1小时缓存
  if (Date.now() - lastLoadTime < 3600000 && cachedWords.length > 0) {
    return cachedWords;
  }

  const res = await fetch('/api/words');
  cachedWords = await res.json();
  lastLoadTime = Date.now();
  return cachedWords;
}

export function getRandomWord(words: any[]) {
  return words[Math.floor(Math.random() * words.length)];
}

const DB_NAME = 'wordDB';
const STORE_NAME = 'wordsStore';

export async function initDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getCachedWords(): Promise<any[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
      db.close();
    };
    
    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

export async function cacheWords(words: any[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // 先清空原有数据
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      // 批量添加新数据
      words.forEach(word => store.add(word));
      
      transaction.oncomplete = () => {
        resolve();
        db.close();
      };
      
      transaction.onerror = () => {
        reject(transaction.error);
        db.close();
      };
    };
    
    clearRequest.onerror = () => {
      reject(clearRequest.error);
      db.close();
    };
  });
}