#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
matrix-view — Genera matrices de funcionalidades como HTML interactivo

Uso:
  matrix-view <matrix.json>              Abre en el browser
  matrix-view <matrix.json> --out <file> Guarda HTML sin abrir
  matrix-view --schema                   Muestra el schema JSON esperado

Ejemplos:
  matrix-view /tmp/matrix-output.json
  matrix-view matrix.json --out resultado.html
`);
  process.exit(0);
}

if (args[0] === '--schema') {
  const schema = {
    title: "Nombre descriptivo de la matriz",
    context: "migration | permissions | coverage | tabs | api",
    feature_flag: "nombre_del_flag (opcional)",
    jira_ticket: "TL-1234 (opcional)",
    generated_at: "ISO 8601",
    source_url: "/ruta/de/la/vista (opcional)",
    tabs: [
      {
        id: "with_ff",
        name: "Con FF activo",
        subtabs: [
          {
            id: "participantes",
            name: "Participantes",
            description: "Descripción opcional del subtab",
            sections: [
              {
                name: "Campos",
                items: [
                  {
                    id: "unique-item-id",
                    label: "Nombre legible (traducido)",
                    tech_name: "nombre_tecnico_opcional",
                    status: "pending | done | review | na",
                    notes: "Nota opcional explicativa"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  console.log(JSON.stringify(schema, null, 2));
  process.exit(0);
}

const inputFile = args[0];
const outFlag = args.indexOf('--out');
const outputFile = outFlag !== -1 ? args[outFlag + 1] : null;

if (!fs.existsSync(inputFile)) {
  console.error(`Error: no se encontró el archivo "${inputFile}"`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
} catch (e) {
  console.error(`Error: JSON inválido en "${inputFile}"\n${e.message}`);
  process.exit(1);
}

const templatePath = path.join(__dirname, '..', 'template.html');
if (!fs.existsSync(templatePath)) {
  console.error('Error: no se encontró template.html junto al binario');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const html = template.replace('/*__MATRIX_DATA__*/', `const MATRIX_DATA = ${JSON.stringify(data, null, 2)};`);

const target = outputFile || path.join(os.tmpdir(), `matrix-view-${Date.now()}.html`);
fs.writeFileSync(target, html);

if (outputFile) {
  console.log(`✅ Guardado en: ${outputFile}`);
} else {
  const opener = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open';
  try {
    execSync(`${opener} "${target}"`);
    console.log(`✅ Abierto en browser: ${target}`);
  } catch {
    console.log(`✅ Generado en: ${target}`);
    console.log('   Abre el archivo manualmente en tu browser.');
  }
}
