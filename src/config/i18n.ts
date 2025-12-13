import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../len/en.json';
import ar from '../len/ar.json';
import tr from '../len/tr.json';
import zh from '../len/zh.json';


if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
        tr: { translation: tr },
        zh: { translation: zh },
      },
      lng: localStorage.getItem('lang') || 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;
