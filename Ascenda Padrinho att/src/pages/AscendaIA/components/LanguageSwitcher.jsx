import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, useTranslation } from '@/i18n';

const OPTIONS = [
  { value: 'pt', flag: 'fi fi-br', key: 'ascendaQuiz.language.pt' },
  { value: 'en', flag: 'fi fi-us', key: 'ascendaQuiz.language.en' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);

  const activeOption = OPTIONS.find((option) => option.value === language) ?? OPTIONS[0];

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

  const handleOptionClick = React.useCallback(
    (value) => {
      setLanguage(value);
      close();
    },
    [setLanguage, close],
  );

  React.useEffect(() => {
    function handleOutside(event) {
      if (!buttonRef.current) return;
      if (!buttonRef.current.parentElement?.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }
    return undefined;
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`${activeOption.flag} h-3 w-4 rounded-sm`} aria-hidden="true"></span>
        <span>{t(activeOption.key)}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-white/15 bg-surface/90 p-2 text-sm text-white shadow-e2 backdrop-blur-md"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              close();
            }
          }}
        >
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.16em] text-white/50">
            {t('ascendaQuiz.language.label')}
          </p>
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 ${
                option.value === language ? 'bg-white/10' : ''
              }`}
              role="option"
              aria-selected={option.value === language}
            >
              <span className={`${option.flag} h-3 w-4 rounded-sm`} aria-hidden="true"></span>
              <span>{t(option.key)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
