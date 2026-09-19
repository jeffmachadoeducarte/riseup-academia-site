import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Revelacoes } from '@/components/Revelacoes';
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp';
import { FaixaMarca } from '@/components/FaixaMarca';

import { Hero } from '@/components/sections/Hero';
import { Sobre } from '@/components/sections/Sobre';
import { Estrutura } from '@/components/sections/Estrutura';
import { Treinos } from '@/components/sections/Treinos';
import { Diferenciais } from '@/components/sections/Diferenciais';
import { Experiencia } from '@/components/sections/Experiencia';
import { ProvaSocial } from '@/components/sections/ProvaSocial';
import { Instagram } from '@/components/sections/Instagram';
import { Localizacao } from '@/components/sections/Localizacao';
import { CtaFinal } from '@/components/sections/CtaFinal';

/**
 * Home — página única.
 *
 * A ordem segue a jornada comercial definida no briefing:
 * impacto → identidade → confiança → estrutura → experiência →
 * prova social → localização → conversão.
 */
export default function Home() {
  return (
    <>
      <Header />

      <main id="conteudo">
        <Hero />
        <Sobre />
        <FaixaMarca />
        <Estrutura />
        <Treinos />
        <Diferenciais />
        <Experiencia />
        <ProvaSocial />
        <Instagram />
        <Localizacao />
        <CtaFinal />
      </main>

      <Footer />
      <BotaoWhatsApp />
      <Revelacoes />
    </>
  );
}
