import { ProcessResult, PatentGroup } from '../types';

/**
 * Extracts country code from the start of a string if it matches 2 letters.
 */
const extractCountryFromId = (patentId: string): string | null => {
  const cleaned = patentId.trim().toUpperCase();
  if (cleaned.length >= 2) {
    const prefix = cleaned.substring(0, 2);
    // Check if first two chars are letters
    if (/^[A-Z]{2}$/.test(prefix)) {
      return prefix;
    }
  }
  return null;
};

export const processPatentData = (rawText: string): ProcessResult => {
  const lines = rawText.split(/\r?\n/);
  const groups: Record<string, Set<string>> = {}; // Use Set to prevent duplicates
  let totalLines = 0;
  let validPatents = 0;
  let unknownCount = 0;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Skip empty lines

    totalLines++;

    let patentId = trimmedLine;
    let countryCode: string | null = null;

    // Detect delimiters (Comma, Tab, Pipe, Semicolon)
    let parts = [trimmedLine];
    if (trimmedLine.includes(',')) parts = trimmedLine.split(',');
    else if (trimmedLine.includes('\t')) parts = trimmedLine.split('\t');
    else if (trimmedLine.includes('|')) parts = trimmedLine.split('|');
    else if (trimmedLine.includes(';')) parts = trimmedLine.split(';');

    // Clean parts
    parts = parts.map(p => p.trim().replace(/^["']|["']$/g, '')); // Remove quotes

    if (parts.length >= 2) {
      // Multi-column logic: Identify which part is Country and which is ID
      
      // 1. Look for explicit 2-letter country code column
      const countryPartIndex = parts.findIndex(p => /^[A-Za-z]{2}$/.test(p));
      
      // 2. Look for Patent ID (alphanumeric, length > 2 to avoid confusion with country code)
      // Priority: Longest alphanumeric string usually is the ID
      const sortedByLen = [...parts].sort((a, b) => b.length - a.length);
      const bestIdCandidate = sortedByLen.find(p => /\d/.test(p) && p.length > 2);

      if (countryPartIndex !== -1) {
        countryCode = parts[countryPartIndex].toUpperCase();
        
        // If we found a country column, the ID is likely one of the other columns
        if (bestIdCandidate) {
          patentId = bestIdCandidate;
        } else {
          // Fallback: take the part that isn't the country code
          const otherPart = parts.find((_, idx) => idx !== countryPartIndex);
          if (otherPart) patentId = otherPart;
        }
      } else {
        // No explicit country column found, assume the best ID candidate is the ID
        if (bestIdCandidate) {
          patentId = bestIdCandidate;
        }
        // We will extract country from the ID later
      }
    }

    // If country not yet determined, try to extract from the Patent ID
    if (!countryCode) {
      countryCode = extractCountryFromId(patentId);
    }

    if (countryCode && patentId) {
      if (!groups[countryCode]) {
        groups[countryCode] = new Set();
      }
      // We store ONLY the patent ID, effectively "ignoring other fields"
      groups[countryCode].add(patentId);
      validPatents++;
    } else {
      unknownCount++;
    }
  });

  // Convert map to array and sort alphabetically by country
  const groupArray: PatentGroup[] = Object.entries(groups)
    .map(([countryCode, patentSet]) => ({
      countryCode,
      patents: Array.from(patentSet),
    }))
    .sort((a, b) => a.countryCode.localeCompare(b.countryCode));

  return {
    groups: groupArray,
    stats: {
      totalLines,
      validPatents,
      uniqueCountries: groupArray.length,
      unknownCount,
    },
    timestamp: Date.now(),
  };
};