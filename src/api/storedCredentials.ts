const readCredentials = (): { id: string; token: string } | null => {
  try {
    const unsafe = window.localStorage.getItem('credentials');
    if (unsafe === null) return null;
    const safe = unsafe.replace(/[^a-zA-Z0-9{":,}\_\-]/g, '');
    const parsed = JSON.parse(safe);
    if (parsed && parsed.id && parsed.token) return parsed;
    else return null;
  } catch (error) {
    // TODO: maybe warn user to use a newer browser; maybe check beforehand with "typeof Storage"
    console.error('could not write credentials', error);
    return null;
  }
};

const writeCredentials = (credentials: { id: string; token: string }): void => {
  try {
    window.localStorage.setItem('credentials', JSON.stringify(credentials));
  } catch (error) {
    console.error('could not write credentials', error);
  }
};

const deleteCredentials = (): void => {
  try {
    window.localStorage.removeItem('credentials');
  } catch (error) {
    console.error('could not delete credentials', error);
  }
};

export default {
  read: readCredentials,
  write: writeCredentials,
  delete: deleteCredentials,
};
