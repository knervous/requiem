
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader(new THREE.LoadingManager());
const idbVersion = 3;
const textureTable = 'texture';
const textureTableData = 'data';

const createTextureTable = () =>
  new Promise(res => {
    const textureTableRequest = indexedDB.open(textureTable, idbVersion);
    textureTableRequest.onsuccess = res;
    textureTableRequest.onupgradeneeded = event => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      try {
        db.deleteObjectStore(textureTableData);
      } catch {}
      const dataStore = db.createObjectStore(textureTableData, { keyPath: 'texturePath' });
      dataStore.createIndex('texturePath', 'texturePath', { unique: false });
      res();
    };
  });

const deleteDatabase = name =>
  new Promise(res => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = request.onerror = request.onupgradeneeded = request.onblocked = res;
  });


const getTextureEntry = texturePath =>
  new Promise(res => {
    const request = indexedDB.open(textureTable, idbVersion);
    request.onsuccess = async event => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      try {
        const transaction = db.transaction([textureTableData]);
        const textureStore = transaction.objectStore(textureTableData);
        const textureRequest = textureStore.get(texturePath);
        textureRequest.onerror = () => res(null);
        textureRequest.onsuccess = () => {
          res(textureRequest.result);
        };
      } catch (e) {
        console.warn({ message: 'Error with tex transaction', error: e });
        await deleteDatabase(textureTable);
        await createTextureTable();
        res(await getTextureEntry(texturePath));
      }
    };
    request.onerror = () => res(undefined);
  });

const setTextureEntry = (texturePath, data) =>
  new Promise(res => {
    const request = indexedDB.open(textureTable, idbVersion);
    request.onsuccess = event => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const textureStore = db.transaction(textureTableData, 'readwrite').objectStore(textureTableData);
      const textureRequest = textureStore.put({ data, texturePath });

      textureRequest.onerror = () => res(null);
      textureRequest.onsuccess = () => res(textureRequest.result);
    };
    request.onerror = () => res(undefined);
  });


// Initialize meta table immediately
const prom = createTextureTable();

export const useCachedTexture = name => {
  const [texture, setTexture] = useState(null);
  const [complete, setComplete] = useState(0);
  useEffect(() => {
    let current = true;
    setComplete(0);
    (async () => {
      const cachedTexture = await getCachedTexture(name, setComplete);
      if (current) {
        setTexture(cachedTexture);
      }
    })();
    return () => current = false;
  }, [name]);

  return [texture, complete];
};

export const getCachedTexture = async (name, onProgress = () => {}, _onUnpack = () => {}) => {
  await prom;
  const cachedTexture = await getTextureEntry(name);

  const fetchTexture = async () => {
    const response = await fetch(name);
    if (response.status === 404) {
      throw new Error(`Texture not found ${name}`);
    }
    const reader = response.body.getReader();
    // Step 2: get total length
    const contentLength = +response.headers.get('Content-Length');

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    const chunks = []; // array of received binary chunks (comprises the body)
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      onProgress(receivedLength / contentLength);
    }

    // Step 4: concatenate chunks into single Uint8Array
    const chunksAll = new Uint8Array(receivedLength); // (4.1)

    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position); // (4.2)
      position += chunk.length;
    }

    return chunksAll.buffer;
  };
  const arrBuff = cachedTexture?.data ?? await fetchTexture();
  const texture = await gltfLoader.parseAsync(arrBuff);

  if (!cachedTexture?.data) {
    await setTextureEntry(name, arrBuff);
  }
  onProgress(1);
  return texture;
};