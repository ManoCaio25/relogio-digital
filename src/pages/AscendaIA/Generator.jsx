import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { quizService } from '../../services/quiz.service.mock';
import { Button } from '../../components/common/ui/Button';

const Generator = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [lastTemplate, setLastTemplate] = useState(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    const template = await quizService.generate(prompt);
    setLastTemplate(template);
    setPrompt('');
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('generator.title')}</h1>
        <p className="text-sm text-slate-300">{t('generator.description')}</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="text-sm text-slate-300">{t('generator.prompt')}</label>
        <textarea
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGenerate}>{t('generator.generate')}</Button>
        </div>
      </div>
      {lastTemplate && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs text-primary-200">{t('generator.autoSaved')}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{lastTemplate.title}</h3>
          <p className="mt-1 text-sm text-slate-300">{lastTemplate.description}</p>
        </div>
      )}
    </section>
  );
};

export default Generator;
