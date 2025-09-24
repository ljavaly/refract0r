# Refract0r Scripts

Utility scripts for the Refract0r project.

## Setup

```bash
cd scripts
npm install
```

## Available Scripts

### CSV to JSON Converter

Converts CSV files to JSON format with automatic type conversion.

#### Usage

```bash
# Basic usage
npm run csv-to-json /absolute/path/to/file.csv

# With options
npm run csv-to-json /path/to/data.csv --delimiter ";" --output ./output.json --skip-header
```

#### Options

- `--delimiter <char>`: CSV delimiter (default: comma)
- `--skip-header`: Skip first row as header
- `--output <path>`: Output JSON file path

#### Examples

```bash
# Convert a simple CSV
npm run csv-to-json /Users/john/data/users.csv

# Convert with semicolon delimiter and custom output
npm run csv-to-json ./data.csv --delimiter ";" --output ./converted.json

# Skip header row
npm run csv-to-json /path/to/file.csv --skip-header
```

#### Programmatic Usage

```typescript
import { csvToJson } from './csvToJson.js';

csvToJson('/absolute/path/to/file.csv', {
  delimiter: ',',
  skipHeader: false,
  outputPath: './output.json'
});
```

## Development

```bash
# Build TypeScript
npm run build

# Run TypeScript directly
npm run dev csvToJson.ts /path/to/file.csv
```
