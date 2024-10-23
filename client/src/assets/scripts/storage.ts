// storage.ts

// 1. getLocal -------------------------------------------------------------------------------------
export const getLocal = (key1: string, key2: string, key3: string) => {

  const TITLE: string = process.env.REACT_APP_TITLE || "";
  const localTitle = JSON.parse(localStorage.getItem(TITLE) || "{}");

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    return localTitle?.[key1];
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    return localTitle?.[key1]?.[key2];
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    return localTitle?.[key1]?.[key2]?.[key3];
  }

  return {};
};

// 2. setLocal -------------------------------------------------------------------------------------
export const setLocal = (key1: string, key2: string, key3: string, value: any) => {

  const TITLE: string = process.env.REACT_APP_TITLE || "";
  const localTitle = JSON.parse(localStorage.getItem(TITLE) || "{}");

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    localStorage.setItem(TITLE, JSON.stringify({
      ...localTitle,
      [key1]: {
        ...(localTitle[key1] || {}),
        ...value,
      },
    }));
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    localStorage.setItem(TITLE, JSON.stringify({
      ...localTitle,
      [key1]: {
        ...(localTitle?.[key1] || {}),
        [key2]: {
          ...(localTitle?.[key1]?.[key2] || {}),
          ...value,
        }
      }
    }));
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    localStorage.setItem(TITLE, JSON.stringify({
      ...localTitle,
      [key1]: {
        ...(localTitle?.[key1] || {}),
        [key2]: {
          ...(localTitle?.[key1]?.[key2] || {}),
          [key3]: {
            ...(localTitle?.[key1]?.[key2]?.[key3] || {}),
            ...value,
          }
        }
      }
    }));
  }
};

// 3. getSession -----------------------------------------------------------------------------------
export const getSession = (key1: string, key2: string, key3: string) => {

  const TITLE: string = process.env.REACT_APP_TITLE || "";
  const sessionTitle = JSON.parse(sessionStorage.getItem(TITLE) || "{}");

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    return sessionTitle?.[key1];
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    return sessionTitle?.[key1]?.[key2];
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    return sessionTitle?.[key1]?.[key2]?.[key3];
  }

  return {};
};

// 4. setSession -----------------------------------------------------------------------------------
export const setSession = (key1: string, key2: string, key3: string, value: any) => {

  const TITLE: string = process.env.REACT_APP_TITLE || "";
  const sessionTitle = JSON.parse(sessionStorage.getItem(TITLE) || "{}");

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    sessionStorage.setItem(TITLE, JSON.stringify({
      ...sessionTitle,
      [key1]: {
        ...(sessionTitle[key1] || {}),
        ...value,
      },
    }));
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    sessionStorage.setItem(TITLE, JSON.stringify({
      ...sessionTitle,
      [key1]: {
        ...(sessionTitle?.[key1] || {}),
        [key2]: {
          ...(sessionTitle?.[key1]?.[key2] || {}),
          ...value,
        }
      }
    }));
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    sessionStorage.setItem(TITLE, JSON.stringify({
      ...sessionTitle,
      [key1]: {
        ...(sessionTitle?.[key1] || {}),
        [key2]: {
          ...(sessionTitle?.[key1]?.[key2] || {}),
          [key3]: {
            ...(sessionTitle?.[key1]?.[key2]?.[key3] || {}),
            ...value,
          }
        }
      }
    }));
  }
};
