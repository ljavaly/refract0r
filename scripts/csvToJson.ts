import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

interface CsvToJsonOptions {
  delimiter?: string;
  skipHeader?: boolean;
  outputPath?: string;
  recursive?: boolean;
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

// Function to clean text by converting curly apostrophes to straight apostrophes
function cleanText(text: string): string {
  if (typeof text !== "string") return text;

  // Replace all types of curly quotes with straight quotes using Unicode escape sequences
  return text
    .replace(/[\u2018\u2019]/g, "'") // Convert left (') and right (') single quotation marks to straight apostrophe
    .replace(/[\u201C\u201D]/g, '"'); // Convert left (") and right (") double quotation marks to straight quotes
}

// Function to find all CSV files in a directory
function findCsvFiles(dirPath: string, recursive: boolean = false): string[] {
  const csvFiles: string[] = [];

  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && recursive) {
      // Recursively search subdirectories
      csvFiles.push(...findCsvFiles(fullPath, recursive));
    } else if (stat.isFile() && path.extname(item).toLowerCase() === ".csv") {
      csvFiles.push(fullPath);
    }
  }

  return csvFiles.sort(); // Sort for consistent ordering
}

// Function to process multiple CSV files
async function processCsvDirectory(
  dirPath: string,
  options: CsvToJsonOptions = {},
): Promise<void> {
  const { recursive = false } = options;

  console.log(`🔍 Scanning directory: ${dirPath}`);
  console.log(`   Recursive: ${recursive ? "Yes" : "No"}`);

  const csvFiles = findCsvFiles(dirPath, recursive);

  if (csvFiles.length === 0) {
    console.log(`⚠️  No CSV files found in directory: ${dirPath}`);
    return;
  }

  console.log(`📁 Found ${csvFiles.length} CSV file(s):`);
  csvFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${path.relative(dirPath, file)}`);
  });
  console.log("");

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < csvFiles.length; i++) {
    const csvFile = csvFiles[i];
    const fileName = path.basename(csvFile);

    try {
      console.log(`📄 Processing (${i + 1}/${csvFiles.length}): ${fileName}`);
      await csvToJson(csvFile, options);
      successCount++;
    } catch (error) {
      console.error(
        `❌ Error processing ${fileName}:`,
        error instanceof Error ? error.message : error,
      );
      errorCount++;
    }

    // Add spacing between files (except after the last one)
    if (i < csvFiles.length - 1) {
      console.log("");
    }
  }

  console.log("\n📊 Processing Summary:");
  console.log(`   ✅ Successfully processed: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed to process: ${errorCount} files`);
  }
  console.log(`   📁 Total files: ${csvFiles.length}`);
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
              processedRow[key] = cleanText(value);
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
                processedRow[key] = cleanText(value);
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
              JSON.stringify(result, null, 2) + "\n",
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
  npx ts-node scripts/csvToJson.ts <csv-file-or-directory-path> [options]

Options:
  --delimiter <char>     CSV delimiter (default: comma)
  --output <path>        Output JSON file path (for single files only)
  --recursive            Process subdirectories recursively (for directories only)
  
Note: The first row is always treated as headers and excluded from JSON output.

Examples:
  # Process a single CSV file
  npx ts-node scripts/csvToJson.ts /Users/john/data/users.csv
  npx ts-node scripts/csvToJson.ts ./data.csv --delimiter ";" --output ./output.json
  
  # Process all CSV files in a directory
  npx ts-node scripts/csvToJson.ts ./scripts/files/csv/
  npx ts-node scripts/csvToJson.ts /path/to/csv/directory --recursive
  
  # Process with custom delimiter
  npx ts-node scripts/csvToJson.ts ./csv-files/ --delimiter ";" --recursive
    `);
    return;
  }

  const inputPath = args[0];
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
      case "--recursive":
        options.recursive = true;
        break;
    }
  }

  try {
    // Check if input path exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Path not found: ${inputPath}`);
    }

    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // Process directory
      if (options.outputPath) {
        console.log(
          "⚠️  Warning: --output option is ignored when processing directories",
        );
        delete options.outputPath;
      }
      await processCsvDirectory(inputPath, options);
    } else if (stat.isFile()) {
      // Process single file
      if (options.recursive) {
        console.log(
          "⚠️  Warning: --recursive option is ignored when processing single files",
        );
      }
      await csvToJson(inputPath, options);
    } else {
      throw new Error(
        `Invalid path: ${inputPath} is neither a file nor a directory`,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Export for programmatic use
export { csvToJson, processCsvDirectory, findCsvFiles };

// Run if called directly (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
