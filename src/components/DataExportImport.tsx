"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ImportStatus = "idle" | "loading" | "success" | "error";

interface DataExportImportProps {
  onDataImported?: () => void;
}

export function DataExportImport({ onDataImported }: DataExportImportProps) {
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "exported"
  >("idle");
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExportStatus("exporting");

    try {
      // Dynamic import to avoid SSR issues
      const { exportAllData, downloadExport } =
        await import("@/services/dataService");

      const data = exportAllData();
      downloadExport(data);

      setExportStatus("exported");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      console.error("Export failed:", error);
      setExportStatus("idle");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus("loading");
    setImportMessage("");

    try {
      const { parseImportFile, importData } =
        await import("@/services/dataService");

      const parsed = await parseImportFile(file);
      const imported = importData(parsed);

      setImportStatus("success");
      setImportMessage(`Successfully imported ${imported} items`);

      // Trigger a page reload to refresh all data
      setTimeout(() => {
        if (onDataImported) {
          onDataImported();
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (error) {
      console.error("Import failed:", error);
      setImportStatus("error");
      setImportMessage(
        error instanceof Error ? error.message : "Failed to import data",
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border border-border bg-card/95 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10">
            <Download className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">
              Backup & Restore
            </CardTitle>
            <CardDescription className="text-xs">
              Export your data or restore from a backup
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Export Section */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Export Data
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Download all your profile and readings as a JSON file
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={exportStatus === "exporting"}
              variant="outline"
              size="sm"
              className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50"
            >
              {exportStatus === "exporting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : exportStatus === "exported" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-2">
                {exportStatus === "exporting"
                  ? "Exporting..."
                  : exportStatus === "exported"
                    ? "Downloaded!"
                    : "Download"}
              </span>
            </Button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Restore Data
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Import data from a previously exported backup file
              </p>
            </div>
            <Button
              onClick={handleImportClick}
              disabled={importStatus === "loading"}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
            >
              {importStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="ml-2">Import</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Import Status Message */}
          <AnimatePresence>
            {importStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-3 flex items-center gap-2 text-sm ${
                  importStatus === "success"
                    ? "text-green-400"
                    : importStatus === "error"
                      ? "text-red-400"
                      : "text-muted-foreground"
                }`}
              >
                {importStatus === "success" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {importStatus === "error" && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {importStatus === "loading" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>{importMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Data Section */}
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-400">
                Clear All Data
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Remove all local data from this browser
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to clear all your data? This cannot be undone.",
                  )
                ) {
                  import("@/services/dataService").then(({ clearAllData }) => {
                    clearAllData();
                    window.location.reload();
                  });
                }
              }}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-2">Clear</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
