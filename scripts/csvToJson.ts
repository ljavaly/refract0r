import * as fs from 'fs';
import * as path from 'path';

interface CsvToJsonOptions {
    delimiter?: string;
    skipHeader?: boolean;
    outputPath?: string;
}

function csvToJson(
    csvFilePath: string,
    options: CsvToJsonOptions = {}
): void {
    const { delimiter = ',', skipHeader = false, outputPath } = options;

    try {
        // Check if CSV file exists
        if (!fs.existsSync(csvFilePath)) {
            throw new Error(`CSV file not found: ${csvFilePath}`);
        }

        // Read CSV file
        const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
        const lines = csvContent.trim().split('\n');

        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }

        // Parse CSV
        const result: any[] = [];
        const headers = lines[0].split(delimiter).map(header => header.trim().replace(/"/g, ''));

        const dataStartIndex = skipHeader ? 1 : 0;

        for (let i = dataStartIndex; i < lines.length; i++) {
            const values = lines[i].split(delimiter).map(value => value.trim().replace(/"/g, ''));

            if (values.length === headers.length) {
                const row: any = {};
                headers.forEach((header, index) => {
                    // Try to parse numbers
                    const value = values[index];
                    if (!isNaN(Number(value)) && value !== '') {
                        row[header] = Number(value);
                    } else if (value.toLowerCase() === 'true') {
                        row[header] = true;
                    } else if (value.toLowerCase() === 'false') {
                        row[header] = false;
                    } else {
                        row[header] = value;
                    }
                });
                result.push(row);
            }
        }

        // Generate output path
        const csvDir = path.dirname(csvFilePath);
        const csvName = path.basename(csvFilePath, path.extname(csvFilePath));
        const outputDir = outputPath || path.join(csvDir, `../json`);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const jsonFilePath = outputPath || path.join(outputDir, `${csvName}.json`);

        // Write JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2), 'utf-8');

        console.log(`✅ Successfully converted CSV to JSON:`);
        console.log(`   Input:  ${csvFilePath}`);
        console.log(`   Output: ${jsonFilePath}`);
        console.log(`   Records: ${result.length}`);

    } catch (error) {
        console.error('❌ Error converting CSV to JSON:', error);
        process.exit(1);
    }
}

// CLI usage
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
📄 CSV to JSON Converter

Usage:
  npx ts-node scripts/csvToJson.ts <csv-file-path> [options]

Options:
  --delimiter <char>     CSV delimiter (default: comma)
  --skip-header          Skip first row as header
  --output <path>        Output JSON file path

Examples:
  npx ts-node scripts/csvToJson.ts /Users/john/data/users.csv
  npx ts-node scripts/csvToJson.ts ./data.csv --delimiter ";" --output ./output.json
  npx ts-node scripts/csvToJson.ts /absolute/path/to/file.csv --skip-header
    `);
        return;
    }

    const csvPath = args[0];
    const options: CsvToJsonOptions = {};

    // Parse arguments
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--delimiter':
                options.delimiter = args[++i];
                break;
            case '--skip-header':
                options.skipHeader = true;
                break;
            case '--output':
                options.outputPath = args[++i];
                break;
        }
    }

    csvToJson(csvPath, options);
}

// Export for programmatic use
export { csvToJson };

// Run if called directly (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
