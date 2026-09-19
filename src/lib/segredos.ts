import 'server-only';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

/**
 * Cofre de segredos — mesma ideia do Educarte.
 *
 * Cifra o que não pode ficar legível no banco: hoje, os tokens do Strava.
 * Quem abrir o arquivo SQLite (backup, volume, dump) não consegue usar a conta
 * Strava de ninguém sem a chave.
 *
 * A chave vem de RISEUP_CHAVE_SEGREDOS. Trocar a chave torna ilegível tudo que
 * foi guardado com ela: os alunos precisam reconectar o Strava. Guarde o valor
 * no gerenciador de senhas — não é uma senha de aplicação, é a chave do cofre.
 */
const ALGORITMO = 'aes-256-gcm';

function chave(): Buffer {
  const bruta = process.env.RISEUP_CHAVE_SEGREDOS;
  if (!bruta || bruta.length < 32) {
    throw new Error(
      'RISEUP_CHAVE_SEGREDOS ausente ou curta demais (mínimo 32 caracteres). ' +
      'Defina a variável antes de usar integrações.',
    );
  }
  // Sal fixo: a chave já é secreta e de alta entropia; o objetivo aqui é só
  // derivar 32 bytes estáveis a partir do texto informado.
  return scryptSync(bruta, 'riseup.cofre.v1', 32);
}

/** Há chave configurada? Usado para desligar integrações com elegância. */
export function cofreConfigurado() {
  const k = process.env.RISEUP_CHAVE_SEGREDOS;
  return typeof k === 'string' && k.length >= 32;
}

export function cifrar(texto: string): string {
  const iv = randomBytes(12);
  const cifra = createCipheriv(ALGORITMO, chave(), iv);
  const dados = Buffer.concat([cifra.update(texto, 'utf8'), cifra.final()]);
  const tag = cifra.getAuthTag();
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${dados.toString('base64url')}`;
}

export function decifrar(guardado: string): string {
  const [versao, ivB64, tagB64, dadosB64] = guardado.split('.');
  if (versao !== 'v1') throw new Error('Formato de segredo desconhecido.');
  const decifra = createDecipheriv(ALGORITMO, chave(), Buffer.from(ivB64, 'base64url'));
  decifra.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([
    decifra.update(Buffer.from(dadosB64, 'base64url')),
    decifra.final(),
  ]).toString('utf8');
}
