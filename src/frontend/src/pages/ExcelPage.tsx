import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
// Native CSV/spreadsheet parser (no external deps)
const parseSpreadsheet = {
  read: (
    buffer: ArrayBuffer,
    filename: string,
  ): { SheetNames: string[]; Sheets: Record<string, unknown[]> } => {
    const text = new TextDecoder("utf-8").decode(buffer);
    const isCSV = filename.toLowerCase().endsWith(".csv");
    const rows = isCSV ? parseCSV(text) : parseCSV(text); // fallback: treat all as CSV-like
    return { SheetNames: ["Sheet1"], Sheets: { Sheet1: rows } };
  },
  sheetToJson: (rows: unknown[]): Record<string, unknown>[] =>
    rows as Record<string, unknown>[],
  jsonToCSV: (data: Record<string, unknown>[]): string => {
    if (data.length === 0) return "";
    const keys = Object.keys(data[0]);
    const header = keys.join(",");
    const body = data
      .map((row) => keys.map((k) => JSON.stringify(row[k] ?? "")).join(","))
      .join("\n");
    return `${header}\n${body}`;
  },
};

function parseCSV(text: string): Record<string, unknown>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const val = values[i] ?? "";
      row[h] = Number.isNaN(Number(val)) || val === "" ? val : Number(val);
    });
    return row;
  });
}
import { Layout } from "../components/Layout";
import { useExcelFiles, useSaveExcelFile } from "../hooks/useQueries";

export function ExcelPage() {
  const saveFile = useSaveExcelFile();
  useExcelFiles();

  const [fileName, setFileName] = useState("");
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = parseSpreadsheet.read(arrayBuffer, file.name);
      const sheetName = workbook.SheetNames[0];
      const rawRows = workbook.Sheets[sheetName];
      const jsonData = parseSpreadsheet.sheetToJson(rawRows);

      if (jsonData.length > 0) {
        const cols = Object.keys(jsonData[0]);
        setColumns(cols);
        setUploadedData(jsonData);
        setFileName(file.name);

        const uint8Data = new Uint8Array(arrayBuffer);
        await saveFile.mutateAsync({ filename: file.name, data: uint8Data });

        toast.success("File uploaded successfully!");
      }
    } catch (_error) {
      toast.error("Failed to parse file. Please use a CSV file.");
    }
  };

  const getNumericColumns = () => {
    if (uploadedData.length === 0) return [];
    return columns.filter((col) => typeof uploadedData[0][col] === "number");
  };

  const getChartData = () => {
    return uploadedData.slice(0, 10).map((row, i) => ({
      name: String(row[columns[0]] || `Row ${i + 1}`),
      ...row,
    }));
  };

  const analyzeQuestion = () => {
    const lowerQ = question.toLowerCase();
    let result = "";

    const numericCols = getNumericColumns();
    if (numericCols.length === 0) {
      result = "No numeric columns found for analysis.";
    } else if (lowerQ.includes("total") || lowerQ.includes("sum")) {
      const col =
        numericCols.find((c) => lowerQ.includes(c.toLowerCase())) ||
        numericCols[0];
      const total = uploadedData.reduce(
        (sum, row) => sum + (Number(row[col]) || 0),
        0,
      );
      result = `The total of ${col} is ${total.toFixed(2)}`;
    } else if (lowerQ.includes("average") || lowerQ.includes("mean")) {
      const col =
        numericCols.find((c) => lowerQ.includes(c.toLowerCase())) ||
        numericCols[0];
      const avg =
        uploadedData.reduce((sum, row) => sum + (Number(row[col]) || 0), 0) /
        uploadedData.length;
      result = `The average of ${col} is ${avg.toFixed(2)}`;
    } else if (lowerQ.includes("max") || lowerQ.includes("highest")) {
      const col =
        numericCols.find((c) => lowerQ.includes(c.toLowerCase())) ||
        numericCols[0];
      const max = Math.max(...uploadedData.map((row) => Number(row[col]) || 0));
      result = `The maximum ${col} is ${max}`;
    } else if (lowerQ.includes("min") || lowerQ.includes("lowest")) {
      const col =
        numericCols.find((c) => lowerQ.includes(c.toLowerCase())) ||
        numericCols[0];
      const min = Math.min(...uploadedData.map((row) => Number(row[col]) || 0));
      result = `The minimum ${col} is ${min}`;
    } else {
      result = `The dataset has ${uploadedData.length} rows and ${columns.length} columns.`;
    }

    setAnalysisResult(result);
  };

  const downloadData = () => {
    const csvContent = parseSpreadsheet.jsonToCSV(uploadedData);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName?.replace(/\.(xlsx|xls)$/i, ".csv") || "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="glow-text font-display text-3xl font-bold">
              Excel Analysis
            </h1>
            <p className="text-muted-foreground">
              Upload and analyze spreadsheets with DJ
            </p>
          </div>
        </div>

        <Card className="glow-border border-primary/50">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Supports .xlsx, .xls, and .csv files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                disabled={saveFile.isPending}
              >
                {saveFile.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </Button>
            </div>
            {fileName && (
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className="border-primary">
                  Loaded: {fileName}
                </Badge>
                <Badge variant="outline">{uploadedData.length} rows</Badge>
                <Badge variant="outline">{columns.length} columns</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {uploadedData.length > 0 && (
          <>
            <Card className="glow-border border-secondary/50">
              <CardHeader>
                <CardTitle>Ask DJ About Your Data</CardTitle>
                <CardDescription>
                  Try: What is the total of Sales? or Show me the average Price
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question about your data..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeQuestion()}
                  />
                  <Button
                    onClick={analyzeQuestion}
                    className="bg-secondary text-secondary-foreground"
                  >
                    Analyze
                  </Button>
                </div>
                {analysisResult && (
                  <Card className="bg-secondary/10 border-secondary/50">
                    <CardContent className="p-4">
                      <p className="text-lg">{analysisResult}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="glow-border border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Data View</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadData}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="table">
                  <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="table"
                    className="max-h-[500px] overflow-auto"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {columns.map((col) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadedData.slice(0, 50).map((row) => (
                          <TableRow
                            key={Object.values(
                              row as Record<string, unknown>,
                            ).join("-")}
                          >
                            {columns.map((col) => (
                              <TableCell key={col}>
                                {String(row[col] ?? "")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="bar">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={getChartData()}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="oklch(var(--foreground))"
                        />
                        <YAxis stroke="oklch(var(--foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(var(--card))",
                            border: "1px solid oklch(var(--border))",
                          }}
                        />
                        <Legend />
                        {getNumericColumns()
                          .slice(0, 3)
                          .map((col, i) => (
                            <Bar
                              key={col}
                              dataKey={col}
                              fill={`oklch(var(--chart-${(i % 5) + 1}))`}
                            />
                          ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="line">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="oklch(var(--foreground))"
                        />
                        <YAxis stroke="oklch(var(--foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(var(--card))",
                            border: "1px solid oklch(var(--border))",
                          }}
                        />
                        <Legend />
                        {getNumericColumns()
                          .slice(0, 3)
                          .map((col, i) => (
                            <Line
                              key={col}
                              type="monotone"
                              dataKey={col}
                              stroke={`oklch(var(--chart-${(i % 5) + 1}))`}
                            />
                          ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
