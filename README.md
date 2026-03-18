# matrix-view

CLI que genera matrices de funcionalidades como HTML interactivo. Diseñado para usarse con skills de Claude Code.

## Instalación

```bash
npm install -g matrix-view
```

O sin instalar, usando npx:

```bash
npx matrix-view matrix.json
```

## Uso

```bash
# Abre en el browser
matrix-view matrix.json

# Guarda como HTML sin abrir
matrix-view matrix.json --out resultado.html

# Ver el schema JSON esperado
matrix-view --schema
```

## Schema JSON

```json
{
  "title": "Nombre descriptivo",
  "context": "migration | permissions | coverage | tabs | api",
  "feature_flag": "nombre_del_flag (opcional)",
  "generated_at": "2024-01-01T00:00:00Z",
  "source_url": "/ruta/de/la/vista (opcional)",
  "axes": {
    "x": ["Columna 1", "Columna 2"],
    "y_groups": [
      {
        "name": "Nombre del grupo",
        "rows": [
          {
            "label": "Nombre legible (traducido)",
            "tech_name": "nombre_tecnico (opcional)",
            "values": ["✅", "❌"],
            "status": "ok | missing | partial | new | unknown",
            "notes": "Nota explicativa (opcional)"
          }
        ]
      }
    ]
  }
}
```

## Valores de status

| Status    | Ícono | Descripción                        |
|-----------|-------|------------------------------------|
| `ok`      | ✅    | Completo / implementado            |
| `missing` | ❌    | Faltante o roto                    |
| `partial` | ⚠️    | Parcial o diferencia detectada     |
| `new`     | 🆕    | Nuevo (no existía en el origen)    |
| `unknown` | ❓    | No determinable sin ejecución      |

Si no se especifica `status`, se infiere de los `values`.

## Integración con Claude Code

Este CLI es llamado automáticamente por el skill `/view-matrix` cuando está instalado. Si no está disponible, el skill muestra la salida como tabla markdown.

```bash
# El skill genera /tmp/matrix-output.json y luego ejecuta:
matrix-view /tmp/matrix-output.json
```

## Ejemplo

```bash
matrix-view --schema > matrix.json
# edita matrix.json con tus datos
matrix-view matrix.json
```
