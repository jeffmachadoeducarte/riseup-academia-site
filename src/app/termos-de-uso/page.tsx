import type { Metadata } from 'next';
import { site } from '@/config/site';
import { PaginaLegal } from '@/components/PaginaLegal';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: `Condições de uso do site institucional da ${site.marca.nome}.`,
  alternates: { canonical: '/termos-de-uso' },
  robots: { index: true, follow: true },
};

export default function Pagina() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizacao="setembro de 2026">
      <p>
        Ao navegar neste site você concorda com as condições abaixo. Ele é
        mantido pela {site.marca.razaoSocial} (CNPJ {site.marca.cnpj}).
      </p>

      <h2>1. Finalidade</h2>
      <p>
        Este é um site institucional. Seu objetivo é apresentar a estrutura, as
        frentes de treino, os horários e a localização da {site.marca.nome}, e
        oferecer canais de contato.
      </p>

      <h2>2. Informações comerciais</h2>
      <p>
        <strong>Este site não divulga preços, planos ou promoções.</strong>{' '}
        Valores, condições de matrícula, fidelidade e grade de aulas devem ser
        confirmados diretamente com a recepção da academia, pelo telefone{' '}
        <a href={site.contato.telefoneHref}>{site.contato.telefone.exibicao}</a> ou
        pelo WhatsApp. Nenhuma informação desta página constitui proposta
        comercial vinculante.
      </p>

      <h2>3. Horários</h2>
      <p>
        Os horários publicados refletem o funcionamento regular da unidade e
        podem mudar em feriados, datas especiais ou por manutenção. Em caso de
        dúvida, confirme antes de se deslocar.
      </p>

      <h2>4. Conteúdo audiovisual</h2>
      <p>
        As imagens e o vídeo deste site são material institucional da{' '}
        {site.marca.nome}, gravados na própria unidade. É proibida a reprodução,
        a distribuição ou o uso comercial sem autorização por escrito.
      </p>

      <h2>5. Saúde e responsabilidade</h2>
      <p>
        Nada neste site substitui avaliação médica ou orientação profissional.
        Antes de iniciar qualquer programa de exercícios, procure um médico. A
        execução dos treinos deve seguir a orientação dos profissionais da
        academia.
      </p>

      <h2>6. Avaliações de terceiros</h2>
      <p>
        Avaliações exibidas neste site foram publicadas por terceiros em
        plataformas públicas, são reproduzidas com indicação de autoria e fonte
        e refletem a opinião de quem as escreveu, não da academia.
      </p>

      <h2>7. Disponibilidade</h2>
      <p>
        Trabalhamos para manter o site no ar e atualizado, mas não garantimos
        funcionamento ininterrupto nem ausência total de erros. Links para
        serviços externos (Google Maps, Instagram, Facebook, WhatsApp) estão
        sujeitos às condições de cada plataforma.
      </p>

      <h2>8. Foro</h2>
      <p>
        Estes termos são regidos pela legislação brasileira, elegendo-se o foro
        da comarca de {site.endereco.cidade}/{site.endereco.uf} para dirimir
        eventuais controvérsias.
      </p>
    </PaginaLegal>
  );
}
