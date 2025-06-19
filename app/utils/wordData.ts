import fs from 'fs';
import path from 'path';

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