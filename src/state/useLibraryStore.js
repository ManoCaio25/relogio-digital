import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { createLocalForageStorage } from './createLocalForageStorage';

const initialTemplates = [
  {
    id: 'tpl-1',
    title: 'Onboarding Tech',
    description: 'Introdução às ferramentas do time.',
    tags: ['Onboarding', 'Tech'],
    difficulty: 'Básico',
    content: 'Perguntas gerais sobre cultura e ferramentas.',
    version: 1,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-2',
    title: 'Power BI Insights',
    description: 'Dashboard e storytelling com dados.',
    tags: ['Dados', 'BI'],
    difficulty: 'Médio',
    content: 'Casos práticos com DAX.',
    version: 1,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      templates: initialTemplates,
      addTemplateFromGenerator(payload) {
        const template = {
          id: `tpl-${nanoid(6)}`,
          version: 1,
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...payload
        };
        set({ templates: [template, ...get().templates] });
        return template;
      },
      updateTemplate(id, patch) {
        set({
          templates: get().templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  ...patch,
                  version: template.version + 1,
                  updatedAt: new Date().toISOString()
                }
              : template
          )
        });
      },
      duplicateTemplate(id) {
        const template = get().templates.find((item) => item.id === id);
        if (!template) return null;
        const duplicated = {
          ...template,
          id: `tpl-${nanoid(6)}`,
          title: `${template.title} (copy)`,
          version: 1,
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set({ templates: [duplicated, ...get().templates] });
        return duplicated;
      },
      archiveTemplate(id, flag = true) {
        set({
          templates: get().templates.map((template) =>
            template.id === id
              ? { ...template, archived: flag, updatedAt: new Date().toISOString() }
              : template
          )
        });
      }
    }),
    {
      name: 'library-store',
      storage: createLocalForageStorage('af')
    }
  )
);
