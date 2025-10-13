import React from "react";
import Layout from "@/Layout";
import { I18nProvider } from "@/components/utils/i18n";
import { AccessibilityProvider } from "@/components/utils/accessibility";
import AIChatWidget from "@/components/ai/AIChat";

export default function App({ children, currentPageName }) {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <Layout currentPageName={currentPageName}>
          {children}
        </Layout>
      </AccessibilityProvider>
    </I18nProvider>
  );
}