/**
 * Data Export/Import Service
 *
 * Handles backing up and restoring all localStorage data for the Vibes app.
 * This allows users to export their profile and readings as a JSON file
 * and restore them later.
 */

export interface VibesExportData {
  version: string;
  exportedAt: string;
  data: {
    profile?: string; // stored as serialized JSON string
    predictions?: Record<string, string>; // key -> serialized JSON
    weeklyPredictions?: Record<string, string>;
    numerology?: Record<string, string>;
    birthCharts?: Record<string, string>;
    moonPhase?: string;
    tarot?: string;
  };
}

/**
 * Get all Vibes-related keys from localStorage
 */
function getAllVibesKeys(): string[] {
  if (typeof window === "undefined") return [];

  const vibesKeys: string[] = [];
  const prefixes = [
    "vibes-",
    "prediction-cache-",
    "weekly-prediction-cache-",
    "numerology-cache_",
    "birth-chart-cache-",
    "moon-phase-cache",
    "vibes_tarot",
  ];

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && prefixes.some((prefix) => key.startsWith(prefix))) {
      vibesKeys.push(key);
    }
  }

  return vibesKeys;
}

/**
 * Export all Vibes data from localStorage to a JSON file
 */
export function exportAllData(): VibesExportData {
  const keys = getAllVibesKeys();

  const exportData: VibesExportData = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    data: {},
  };

  // Group keys by type
  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (!value) continue;

    // Parse and re-stringify to ensure consistent format
    try {
      const parsed = JSON.parse(value);
      const serialized = JSON.stringify(parsed);

      if (key === "vibes-user-profile") {
        exportData.data.profile = serialized;
      } else if (key.startsWith("prediction-cache-")) {
        if (!exportData.data.predictions) {
          exportData.data.predictions = {};
        }
        exportData.data.predictions[key] = serialized;
      } else if (key.startsWith("weekly-prediction-cache-")) {
        if (!exportData.data.weeklyPredictions) {
          exportData.data.weeklyPredictions = {};
        }
        exportData.data.weeklyPredictions[key] = serialized;
      } else if (key.startsWith("numerology-cache_")) {
        if (!exportData.data.numerology) {
          exportData.data.numerology = {};
        }
        exportData.data.numerology[key] = serialized;
      } else if (key.startsWith("birth-chart-cache-")) {
        if (!exportData.data.birthCharts) {
          exportData.data.birthCharts = {};
        }
        exportData.data.birthCharts[key] = serialized;
      } else if (key === "moon-phase-cache") {
        exportData.data.moonPhase = serialized;
      } else if (key === "vibes_tarot") {
        exportData.data.tarot = serialized;
      }
    } catch (e) {
      console.warn(`Failed to parse localStorage key: ${key}`, e);
    }
  }

  return exportData;
}

/**
 * Trigger a download of the exported data as a JSON file
 */
export function downloadExport(exportData: VibesExportData): void {
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `vibes-backup-${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file and restore to localStorage
 * Returns the number of items imported
 */
export function importData(importData: VibesExportData): number {
  if (!importData.data) {
    throw new Error("Invalid backup file: no data found");
  }

  let imported = 0;

  // Import profile
  if (importData.data.profile) {
    window.localStorage.setItem("vibes-user-profile", importData.data.profile);
    imported++;
  }

  // Import predictions
  if (importData.data.predictions) {
    for (const [key, value] of Object.entries(importData.data.predictions)) {
      window.localStorage.setItem(key, value);
      imported++;
    }
  }

  // Import weekly predictions
  if (importData.data.weeklyPredictions) {
    for (const [key, value] of Object.entries(
      importData.data.weeklyPredictions,
    )) {
      window.localStorage.setItem(key, value);
      imported++;
    }
  }

  // Import numerology
  if (importData.data.numerology) {
    for (const [key, value] of Object.entries(importData.data.numerology)) {
      window.localStorage.setItem(key, value);
      imported++;
    }
  }

  // Import birth charts
  if (importData.data.birthCharts) {
    for (const [key, value] of Object.entries(importData.data.birthCharts)) {
      window.localStorage.setItem(key, value);
      imported++;
    }
  }

  // Import moon phase
  if (importData.data.moonPhase) {
    window.localStorage.setItem("moon-phase-cache", importData.data.moonPhase);
    imported++;
  }

  // Import tarot
  if (importData.data.tarot) {
    window.localStorage.setItem("vibes_tarot", importData.data.tarot);
    imported++;
  }

  return imported;
}

/**
 * Parse an uploaded JSON file
 */
export function parseImportFile(file: File): Promise<VibesExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as VibesExportData;

        // Validate structure
        if (!parsed.version || !parsed.exportedAt || !parsed.data) {
          throw new Error("Invalid backup file format");
        }

        resolve(parsed);
      } catch (err) {
        reject(
          new Error(
            "Failed to parse backup file. Please ensure it's a valid Vibes backup.",
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Clear all Vibes data from localStorage
 */
export function clearAllData(): void {
  const keys = getAllVibesKeys();
  for (const key of keys) {
    window.localStorage.removeItem(key);
  }
}
