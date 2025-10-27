import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

interface CsvToJsonOptions {
  delimiter?: string;
  skipHeader?: boolean;
  outputPath?: string;
}

// Helper function to detect if a value was quoted in the raw CSV line
function isValueQuotedInRawLine(
  rawLine: string,
  columnIndex: number,
  delimiter: string,
): boolean {
  if (!rawLine) return false;

  let currentColumn = 0;
  let inQuotes = false;
  let i = 0;
  let fieldStart = 0;

  while (i < rawLine.length) {
    const char = rawLine[i];

    if (char === '"') {
      if (inQuotes && rawLine[i + 1] === '"') {
        // Escaped quote
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // Found field boundary
      if (currentColumn === columnIndex) {
        // This is our target field
        const fieldContent = rawLine.substring(fieldStart, i).trim();
        return fieldContent.startsWith('"') && fieldContent.endsWith('"');
      }
      currentColumn++;
      fieldStart = i + 1;
    }
    i++;
  }

  // Handle the last field
  if (currentColumn === columnIndex) {
    const fieldContent = rawLine.substring(fieldStart).trim();
    return fieldContent.startsWith('"') && fieldContent.endsWith('"');
  }

  return false;
}

function csvToJson(
  csvFilePath: string,
  options: CsvToJsonOptions = {},
): Promise<void> {
  const { delimiter = ",", skipHeader = false, outputPath } = options;

  return new Promise((resolve, reject) => {
    try {
      // Check if CSV file exists
      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const result: any[] = [];
      let headers: string[] = [];
      let rawLines: string[] = [];

      // First, read the entire file to get raw lines for quote detection
      const csvContent = fs.readFileSync(csvFilePath, "utf-8");
      rawLines = csvContent.trim().split("\n");

      // Create read stream and pipe through csv-parser
      fs.createReadStream(csvFilePath)
        .pipe(
          csv({
            separator: delimiter,
          }),
        )
        .on("headers", (headerList) => {
          headers = headerList;
        })
        .on("data", (row: any, index: number) => {
          const rowId = result.length + 1; // +1 to skip header

          // Process each row
          const processedRow: any = {};
          const rawLine = rawLines[rowId];

          // Add row ID (1-based indexing)
          processedRow["id"] = rowId;

          Object.keys(row).forEach((key) => {
            // Skip columns with blank/empty headers
            if (!key || key.trim() === "") {
              return;
            }

            const value = row[key];
            const columnIndex = headers.indexOf(key);

            // Check if this value was originally quoted by examining the raw line
            const wasQuoted = isValueQuotedInRawLine(
              rawLine,
              columnIndex,
              delimiter,
            );

            // If the value was quoted, keep it as a string
            if (wasQuoted) {
              processedRow[key] = value;
            } else {
              // Try to parse numbers only for unquoted values
              if (
                !isNaN(Number(value)) &&
                value !== "" &&
                !isNaN(parseFloat(value))
              ) {
                processedRow[key] = Number(value);
              } else if (value.toLowerCase() === "true") {
                processedRow[key] = true;
              } else if (value.toLowerCase() === "false") {
                processedRow[key] = false;
              } else {
                processedRow[key] = value;
              }
            }
          });

          result.push(processedRow);
        })
        .on("end", () => {
          try {
            // Generate output path
            const csvDir = path.dirname(csvFilePath);
            const csvName = path.basename(
              csvFilePath,
              path.extname(csvFilePath),
            );

            // Simplify filename: lowercase, replace spaces/special chars with underscores, remove duplicates
            let simplifiedName = csvName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric with underscores
              .replace(/_+/g, "_") // Replace multiple underscores with single
              .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

            // Remove duplicate patterns (like "1_rp_home_invasion_1_rp_home_invasion")
            const segments = simplifiedName.split("_");
            const halfLength = Math.floor(segments.length / 2);

            // Check if first half equals second half
            if (segments.length > 2 && segments.length % 2 === 0) {
              const firstHalf = segments.slice(0, halfLength).join("_");
              const secondHalf = segments.slice(halfLength).join("_");

              if (firstHalf === secondHalf) {
                simplifiedName = firstHalf;
              }
            }

            const outputDir = outputPath || path.join(csvDir, `../json`);

            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            const jsonFilePath =
              outputPath || path.join(outputDir, `${simplifiedName}.json`);

            // Write JSON file
            fs.writeFileSync(
              jsonFilePath,
              JSON.stringify(result, null, 2),
              "utf-8",
            );

            console.log(`✅ Successfully converted CSV to JSON:`);
            console.log(`   Input:  ${csvFilePath}`);
            console.log(`   Output: ${jsonFilePath}`);
            console.log(`   Records: ${result.length}`);

            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          reject(new Error(`Error parsing CSV: ${error.message}`));
        });
    } catch (error) {
      reject(error);
    }
  });
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📄 CSV to JSON Converter

Usage:
  npx ts-node scripts/csvToJson.ts <csv-file-path> [options]

Options:
  --delimiter <char>     CSV delimiter (default: comma)
  --output <path>        Output JSON file path
  
Note: The first row is always treated as headers and excluded from JSON output.

Examples:
  npx ts-node scripts/csvToJson.ts /Users/john/data/users.csv
  npx ts-node scripts/csvToJson.ts ./data.csv --delimiter ";" --output ./output.json
  npx ts-node scripts/csvToJson.ts /absolute/path/to/file.csv
    `);
    return;
  }

  const csvPath = args[0];
  const options: CsvToJsonOptions = {};

  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case "--delimiter":
        options.delimiter = args[++i];
        break;
      case "--skip-header":
        options.skipHeader = true;
        break;
      case "--output":
        options.outputPath = args[++i];
        break;
    }
  }

  try {
    await csvToJson(csvPath, options);
  } catch (error) {
    console.error("❌ Error converting CSV to JSON:", error);
    process.exit(1);
  }
}

// Export for programmatic use
export { csvToJson };

// Run if called directly (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
