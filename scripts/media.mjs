#!/usr/bin/env node
/**
 * Pipeline de mídia — Rise Up Academia
 * ------------------------------------------------------------------
 * Gera TODOS os assets web (vídeos otimizados, posters e imagens) a
 * partir do reel original preservado em `assets/source/`.
 *
 * O arquivo original NUNCA é modificado — apenas lido.
 *
 *   npm run media            # gera tudo
 *   npm run media -- --force # regenera mesmo se já existir
 *
 * Requer ffmpeg: usa `ffmpeg-static` (devDependency) ou o ffmpeg do
 * sistema, o que estiver disponível.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');

function resolveBin(pkg, fallback) {
  try {
    const mod = require(pkg);
    const bin = typeof mod === 'string' ? mod : mod.path;
    if (bin && existsSync(bin)) return bin;
  } catch { /* pacote ausente — usa o binário do sistema */ }
  return fallback;
}
const FFMPEG = resolveBin('ffmpeg-static', 'ffmpeg');
const FFPROBE = resolveBin('ffprobe-static', 'ffprobe');

const SOURCE = path.join(ROOT, 'assets/source/rise-up-reel-original.mp4');
const OUT = {
  video: path.join(ROOT, 'public/assets/video'),
  posters: path.join(ROOT, 'public/assets/posters'),
  images: path.join(ROOT, 'public/assets/images'),
};

/**
 * Momentos escolhidos após análise quadro a quadro do reel (44,5 s).
 * `t` = segundo exato do frame dentro do reel.
 */
const FRAMES = [
  // Fachada com o letreiro da academia — primeiro frame do reel.
  { t: 0.2,  name: 'hero-poster' },

  // Duas alunas no salão, olhando para a câmera — melhor foto humana do reel.
  { t: 31,   name: 'sobre-equipe' },

  // ---- estrutura (galeria) ----
  { t: 32,   name: 'estrutura-salao' },      // salão + grama sintética + letreiro UP
  { t: 17,   name: 'estrutura-cross' },      // assault bike diante da parede RISE UP
  { t: 11,   name: 'estrutura-cardio' },     // esteiras sob LED
  { t: 15,   name: 'estrutura-funcional' },  // corda naval sobre grama sintética
  { t: 28,   name: 'estrutura-coletivas' },  // turma com barras na sala espelhada
  { t: 37,   name: 'estrutura-livres' },     // agachamento no rack
  { t: 29,   name: 'estrutura-studio' },     // sala espelhada com bolas suíças
  { t: 41,   name: 'estrutura-maquinas' },   // panorâmica de bancos e máquinas

  // ---- modalidades ----
  { t: 34,   name: 'modalidade-musculacao' },     // desenvolvimento com barra
  { t: 12,   name: 'modalidade-cardio' },         // esteira
  { t: 18,   name: 'modalidade-funcional' },      // kettlebell
  { t: 22,   name: 'modalidade-lutas' },          // treino de golpes em dupla
  { t: 27,   name: 'modalidade-coletivas' },      // turma na sala espelhada
  { t: 5,    name: 'modalidade-acompanhamento' }, // instrutora orientando aluna

  // ---- avulsos ----
  { t: 26,   name: 'experiencia-capa' },  // aluna de camiseta Rise Up agachando
  { t: 43,   name: 'marca-fachada' },     // letreiro interno da marca
];

/** Larguras geradas para cada imagem (srcset). */
const WIDTHS = [480, 720];

function sh(bin, args) {
  return execFileSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
}
function ensure(dir) { mkdirSync(dir, { recursive: true }); }
function kb(file) { return (statSync(file).size / 1024).toFixed(0); }
function mb(file) { return (statSync(file).size / 1024 / 1024).toFixed(2); }
function skip(file) {
  if (!FORCE && existsSync(file)) { console.log(`  · mantido  ${path.relative(ROOT, file)}`); return true; }
  return false;
}

function probe() {
  const raw = sh(FFPROBE, ['-v', 'error', '-show_entries',
    'stream=codec_type,codec_name,width,height,r_frame_rate:format=duration,size,bit_rate',
    '-of', 'json', SOURCE]);
  const j = JSON.parse(raw);
  const v = j.streams.find((s) => s.codec_type === 'video');
  return {
    width: v.width, height: v.height, codec: v.codec_name,
    fps: eval(v.r_frame_rate), // ex.: "30/1"
    duration: Number(j.format.duration),
    sizeMB: (Number(j.format.size) / 1024 / 1024).toFixed(2),
  };
}

/* ---------------------------------------------------------------- vídeo */

/**
 * O hero usa um recorte de 22 s do reel (montagem completa de ambientes:
 * musculação → acompanhamento → cardio → funcional → lutas). O reel inteiro
 * (44,5 s, com áudio) fica reservado para a seção "Experiência", carregado
 * apenas sob demanda.
 */
const HERO_CUT = { start: 0, duration: 22 };

function buildVideos() {
  ensure(OUT.video);
  const cut = ['-ss', String(HERO_CUT.start), '-t', String(HERO_CUT.duration)];
  const jobs = [
    {
      // Hero desktop/tablet — sem áudio, loop de ambientação
      out: 'rise-up-hero.mp4',
      args: [...cut, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryslow',
        '-crf', '30', '-maxrate', '1000k', '-bufsize', '2000k', '-g', '60',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
    },
    {
      // Hero mobile — resolução e bitrate reduzidos para 4G
      out: 'rise-up-hero-mobile.mp4',
      args: [...cut, '-an', '-vf', 'scale=540:-2:flags=lanczos', '-c:v', 'libx264',
        '-profile:v', 'main', '-preset', 'veryslow', '-crf', '32', '-maxrate', '600k',
        '-bufsize', '1200k', '-g', '60', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
    },
    {
      // Hero WebM (VP9) — servido antes do MP4 quando o navegador suporta
      out: 'rise-up-hero.webm',
      args: [...cut, '-an', '-c:v', 'libvpx-vp9', '-crf', '42', '-b:v', '900k',
        '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-g', '60'],
    },
    {
      // Seção "Experiência" — reel completo com áudio, preload="none"
      out: 'rise-up-experiencia.mp4',
      args: ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '29',
        '-maxrate', '1300k', '-bufsize', '2600k', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart'],
    },
  ];

  for (const job of jobs) {
    const dest = path.join(OUT.video, job.out);
    if (skip(dest)) continue;
    process.stdout.write(`  · gerando ${job.out} … `);
    sh(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-i', SOURCE, ...job.args, dest]);
    console.log(`${mb(dest)} MB`);
  }
}

/* --------------------------------------------------------------- imagens */

function buildImages() {
  ensure(OUT.images);
  ensure(OUT.posters);

  for (const f of FRAMES) {
    const isPoster = f.name.endsWith('-poster');
    const dir = isPoster ? OUT.posters : OUT.images;

    for (const w of WIDTHS) {
      for (const [ext, codecArgs] of [
        ['webp', ['-c:v', 'libwebp', '-quality', '82', '-compression_level', '6']],
        ['jpg', ['-q:v', '4']],
      ]) {
        const dest = path.join(dir, `${f.name}-${w}.${ext}`);
        if (skip(dest)) continue;
        // `-ss` DEPOIS de `-i`: seek exato. Antes de `-i` o ffmpeg salta para o
        // keyframe anterior e entrega um frame diferente do pedido.
        sh(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y',
          '-i', SOURCE, '-ss', String(f.t), '-frames:v', '1',
          '-vf', `scale=${w}:-2:flags=lanczos`, ...codecArgs, dest]);
        console.log(`  · ${path.relative(ROOT, dest)} — ${kb(dest)} KB`);
      }
    }
  }

  // Poster ultraleve (blur) usado como placeholder e fundo ambiente do hero
  const blur = path.join(OUT.posters, 'hero-poster-blur.jpg');
  if (!skip(blur)) {
    sh(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-i', SOURCE, '-ss', '0.2',
      '-frames:v', '1', '-vf', 'scale=32:-2:flags=lanczos', '-q:v', '8', blur]);
    console.log(`  · ${path.relative(ROOT, blur)} — ${kb(blur)} KB (LQIP)`);
  }
}

/* ------------------------------------------------------------------ main */

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`\n✖ Vídeo original não encontrado em ${path.relative(ROOT, SOURCE)}`);
    console.error('  Coloque o reel original nesse caminho e rode novamente.\n');
    process.exit(1);
  }

  console.log('\n══ RISE UP — pipeline de mídia ═══════════════════════════════\n');
  const info = probe();
  console.log(`Original : ${path.relative(ROOT, SOURCE)}`);
  console.log(`Formato  : ${info.width}×${info.height} · ${info.codec} · ${info.fps} fps`);
  console.log(`Duração  : ${info.duration.toFixed(2)} s · ${info.sizeMB} MB\n`);

  console.log('VÍDEO');
  buildVideos();
  console.log('\nIMAGENS');
  buildImages();

  console.log('\n✔ Concluído. Original preservado intacto.\n');
}

main();
