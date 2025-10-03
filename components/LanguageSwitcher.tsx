import React from 'react';
import { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language: currentLanguage, setLanguage, t } = useLanguage();

    const languages = [
        { id: Language.EN, name: t('langEnglish'), flag: '🇬🇧' },
        { id: Language.ES, name: t('langSpanish'), flag: '🇪🇸' },
        { id: Language.FR, name: t('langFrench'), flag: '🇫🇷' },
        { id: Language.DE, name: t('langGerman'), flag: '🇩🇪' },
    ];

    return (
        <div className="flex flex-col space-y-3">
            {languages.map(lang => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className="flex items-center gap-3 group w-full text-left"
                    aria-label={`Switch to ${lang.name}`}
                >
                    <span className={`text-lg transition-transform duration-300 ${currentLanguage === lang.id ? 'scale-125' : 'group-hover:scale-110'}`}>{lang.flag}</span>
                    <span
                        className={`group-hover:text-[var(--custom-accent-color,theme(colors.blue.400))] transition-colors ${
                            currentLanguage === lang.id ? 'text-[var(--custom-accent-color,theme(colors.blue.400))] font-semibold' : ''
                        }`}
                    >
                        {lang.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
