import { SceneLoader, SceneSerializer, Tools } from '@babylonjs/core';

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
      const dataStore = db.createObjectStore(textureTableData, {
        keyPath: 'texturePath'
      });
      dataStore.createIndex('texturePath', 'texturePath', { unique: false });
      res();
    };
  });

const deleteDatabase = name =>
  new Promise(res => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess =
      request.onerror =
      request.onupgradeneeded =
      request.onblocked =
        res;
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
      const textureStore = db
        .transaction(textureTableData, 'readwrite')
        .objectStore(textureTableData);
      const textureRequest = textureStore.put({ data, texturePath });

      textureRequest.onerror = () => res(null);
      textureRequest.onsuccess = () => res(textureRequest.result);
    };
    request.onerror = () => res(undefined);
  });


const prom = createTextureTable();

const pendingModels = {};
export const getCachedTexture = async (storageUrl, model, scene, cb) => {
  await prom;
  if (pendingModels[model]) {
    return await pendingModels[model];
  }

  const cachedTexture = await getTextureEntry(model);

  let res;
  const texturePromise = new Promise(_res => {
    res = _res;
  });

  if (!cachedTexture?.data) {
    pendingModels[model] = texturePromise;
  }

  const dataUri =
    cachedTexture?.data ??
    (await (async () => {
      return new Promise(async res => {
        const assetArrayBuffer = await Tools.LoadFileAsync(
          `${storageUrl}${model}.glb`,
          true
        );
        const assetBlob = new Blob([assetArrayBuffer]);
        const reader = new FileReader();

        reader.onload = event => {
          res(event.target.result);
        };

        reader.readAsDataURL(assetBlob);
      });
    })());
  const texture = await SceneLoader.ImportMeshAsync(
    '',
    '',
    dataUri,
    scene,
    undefined,
    '.glb'
  );

  if (cb) {
    await cb(texture);
  }

  res(texture);
  if (!cachedTexture?.data) {
    await setTextureEntry(model, dataUri);
  }
  
  return texture;
};
