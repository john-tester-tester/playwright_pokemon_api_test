import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class Utility {

async check_json_response_matches_expected_file (jsonResponse: any, expectedAPIResultFile: string, expectedNumberOfResults: number) {

  const expectedFilePath = path.resolve(__dirname, expectedAPIResultFile);

  if (!fs.existsSync(expectedFilePath)) {
    const currentPath = process.cwd();
    throw new Error(`File not found, current path ${currentPath}, expected ${expectedFilePath}`);
  } else {
    const lines = fs.readFileSync(expectedFilePath, 'utf-8').split('\n');
    const actualPaths = Object.values(jsonResponse);
    const actualValues = Object.keys(jsonResponse);
    let numberOfEntries = 0;

    for (const [index, expectedItem] of lines.entries()) {
      const [expectedValue, expectedPath] = expectedItem.split('\t').map((str) => str.trim().replace(/"/g, ''));

      expect(expectedValue).toBe(actualValues[index]);
      expect(expectedPath).toBe(actualPaths[index]);

      numberOfEntries += 1;
    }

    expect(numberOfEntries).toBe(expectedNumberOfResults);  // Assert number of entries matches expected number

  }
}

async check_json_response_matches_expected_result_in_arguments (jsonResponse: any, expectedTotalNumberOfResults: number, expectedKeyValues:  Map<string, string>) {
  let numberOfEntries = 0;
  let actualJSONmap = new Map(Object.entries(jsonResponse));

  for (let [actualKey, actualValue] of actualJSONmap) {

    for (let [expectedKey, expectedValue] of expectedKeyValues) {
      if(!actualJSONmap.has(expectedKey)){
        throw new Error(`expected key \"${expectedKey}\" missing from actual JSON response`);
      } else if (expectedKey === actualKey) {
        expect(expectedValue).toBe(String(actualValue));
      }
    }

    numberOfEntries += 1;
  }  
  expect(numberOfEntries).toBe(expectedTotalNumberOfResults);  // Assert number of entries matches expected number
}

async convert_response_to_JSON (response: string) {
  let result = null;
  try {
    result = JSON.parse(response);

    return result;
  }
  catch(e) {
    console.log(`\nAPI response text: ${response}\n`);
    throw new Error(`${e}, unable to convert response to JSON`);
  }
}

};