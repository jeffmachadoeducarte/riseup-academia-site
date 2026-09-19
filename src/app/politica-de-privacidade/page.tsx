import type { Metadata } from 'next';
import { site } from '@/config/site';
import { PaginaLegal } from '@/components/PaginaLegal';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: `Como a ${site.marca.nome} trata os dados de quem visita este site.`,
  alternates: { canonical: '/politica-de-privacidade' },
  robots: { index: true, follow: true },
};

export default function Pagina() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizacao="setembro de 2026">
      <p>
        Esta política explica como a {site.marca.razaoSocial} (CNPJ {site.marca.cnpj}),
        responsável pela {site.marca.nome}, trata informações de quem acessa este site.
      </p>

      <h2>1. Dados coletados</h2>
      <p>
        Este site é institucional e <strong>não possui formulários de cadastro,
        área de login, carrinho ou processamento de pagamento</strong>. Não
        coletamos nome, e-mail, CPF ou qualquer dado pessoal por meio dele.
      </p>

      <h2>2. Contato por WhatsApp e telefone</h2>
      <p>
        Os botões de contato apenas abrem o WhatsApp ou o discador do seu
        aparelho. A partir do momento em que você inicia a conversa, o
        tratamento dos dados passa a ser regido pela política do WhatsApp
        (Meta Platforms) e pelo atendimento da academia. As mensagens que você
        enviar ficam registradas no aparelho da recepção e são usadas
        exclusivamente para responder à sua solicitação.
      </p>

      <h2>3. Cookies e medição</h2>
      <p>
        Na configuração atual, este site <strong>não instala cookies de
        rastreamento e não utiliza ferramentas de análise de audiência</strong>.
        Caso isso mude, esta política será atualizada antes da ativação e um
        aviso de consentimento será exibido.
      </p>

      <h2>4. Conteúdo de terceiros</h2>
      <p>
        A seção de localização incorpora o Google Maps. Ao carregar o mapa, o
        Google pode registrar seu endereço IP e dados do navegador, conforme a{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer nofollow">
          política de privacidade do Google
        </a>
        . Links para Instagram e Facebook levam para fora deste site e seguem as
        políticas da Meta.
      </p>

      <h2>5. Seus direitos (LGPD)</h2>
      <p>
        Nos termos da Lei nº 13.709/2018, você pode solicitar confirmação de
        tratamento, acesso, correção, anonimização, portabilidade ou eliminação
        de dados pessoais que a academia tenha sobre você — inclusive os obtidos
        por WhatsApp ou presencialmente na recepção.
      </p>
      <p>
        Para exercer qualquer desses direitos, entre em contato pelo telefone{' '}
        <a href={site.contato.telefoneHref}>{site.contato.telefone.exibicao}</a> ou
        diretamente na unidade.
      </p>

      <h2>6. Segurança</h2>
      <p>
        O site é servido exclusivamente por conexão criptografada (HTTPS) e não
        armazena dados de visitantes em banco de dados.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Esta política pode ser revisada a qualquer momento. A data de
        atualização no topo sempre indica a versão vigente.
      </p>
    </PaginaLegal>
  );
}
