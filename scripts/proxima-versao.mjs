#!/usr/bin/env node
// Calcula a próxima versão semântica a partir dos Conventional Commits
// desde a última tag vX.Y.Z (PGC 3.3 e 9).
//
//   feat!: ... ou "BREAKING CHANGE:" no corpo  -> MAJOR
//   feat: ...                                  -> MINOR
//   fix: / perf: ...                           -> PATCH
//   docs, chore, ci, test, refactor, style     -> sem release
//
// Primeira execução, ainda sem tag, publica 1.0.0.
//
// Uso:  node scripts/proxima-versao.mjs
//       NOTAS_ARQUIVO=notas.md node scripts/proxima-versao.mjs

import { execSync } from 'node:child_process';
import { appendFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function classificarCommit(mensagem) {
  const [titulo = '', ...corpo] = mensagem.split('\n');
  if (/^\w+(\([^)]*\))?!:/.test(titulo) || /BREAKING CHANGE:/.test(corpo.join('\n'))) {
    return 'major';
  }
  if (/^feat(\([^)]*\))?:/.test(titulo)) return 'minor';
  if (/^(fix|perf)(\([^)]*\))?:/.test(titulo)) return 'patch';
  return 'none';
}

const PESO = { none: 0, patch: 1, minor: 2, major: 3 };

export function tipoDeIncremento(mensagens) {
  return mensagens
    .map(classificarCommit)
    .reduce((maior, atual) => (PESO[atual] > PESO[maior] ? atual : maior), 'none');
}

export function incrementar(versao, tipo) {
  const [major, minor, patch] = versao.split('.').map(Number);
  if (tipo === 'major') return `${major + 1}.0.0`;
  if (tipo === 'minor') return `${major}.${minor + 1}.0`;
  if (tipo === 'patch') return `${major}.${minor}.${patch + 1}`;
  return versao;
}

export function gerarNotas(versao, mensagens) {
  const grupos = { Funcionalidades: [], Correções: [], Outros: [] };
  for (const mensagem of mensagens) {
    const titulo = mensagem.split('\n')[0];
    const tipo = classificarCommit(mensagem);
    if (tipo === 'major' || tipo === 'minor') grupos.Funcionalidades.push(titulo);
    else if (tipo === 'patch') grupos.Correções.push(titulo);
    else grupos.Outros.push(titulo);
  }

  let texto = `## v${versao}\n`;
  for (const [nome, itens] of Object.entries(grupos)) {
    if (itens.length === 0) continue;
    texto += `\n### ${nome}\n${itens.map((item) => `- ${item}`).join('\n')}\n`;
  }
  return texto;
}

function git(comando) {
  return execSync(`git ${comando}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

function ultimaTag() {
  try {
    return git('describe --tags --abbrev=0 --match "v[0-9]*.[0-9]*.[0-9]*"');
  } catch {
    return null;
  }
}

function main() {
  const tag = ultimaTag();
  const atual = tag ? tag.replace(/^v/, '') : '0.0.0';
  const intervalo = tag ? `${tag}..HEAD` : 'HEAD';
  const separador = '---fim-do-commit---';
  const log = git(`log ${intervalo} --format=%B${separador}`);
  const mensagens = log
    .split(separador)
    .map((mensagem) => mensagem.trim())
    .filter(Boolean);

  let tipo = tipoDeIncremento(mensagens);
  let versao = incrementar(atual, tipo);
  if (!tag && mensagens.length > 0) {
    tipo = 'major';
    versao = '1.0.0';
  }

  if (process.env.NOTAS_ARQUIVO) {
    writeFileSync(process.env.NOTAS_ARQUIVO, gerarNotas(versao, mensagens));
  }

  const saida = { atual, versao, release: String(tipo !== 'none'), tipo };
  for (const [chave, valor] of Object.entries(saida)) {
    console.log(`${chave}=${valor}`);
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(process.env.GITHUB_OUTPUT, `${chave}=${valor}\n`);
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
