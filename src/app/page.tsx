'use client'

import {useState, useCallback, useMemo} from 'react';
import * as XLSX from 'xlsx';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Icons} from "@/components/icons";

interface ExcelData {
  [key: string]: any;
}

export default function Home() {
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<ExcelData | null>(null);
  const [fieldsToPrint, setFieldsToPrint] = useState<string[]>([]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const binaryStr = event.target?.result;
      if (typeof binaryStr === 'string') {
        const workbook = XLSX.read(binaryStr, {type: 'binary'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);

        if (data.length > 0) {
          setExcelData(data);
          setTableColumns(Object.keys(data[0]));
        }
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const filteredData = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return excelData.filter(row => {
      return tableColumns.some(column => {
        const cellValue = String(row[column]).toLowerCase();
        return cellValue.includes(lowerCaseQuery);
      });
    });
  }, [excelData, searchQuery, tableColumns]);

  const handlePrint = (row: ExcelData) => {
    setSelectedRow(row);
    setFieldsToPrint(Object.keys(row)); // Initially select all fields
  };

  const handlePrintFieldsChange = (field: string) => {
    setFieldsToPrint(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const printDocument = () => {
    if (!selectedRow) return;

    const printContent = fieldsToPrint.map(field => {
      return `<div style="margin-bottom: 8px;"><strong>${field}:</strong> ${selectedRow[field]}</div>`;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Billing Printout</title>
          <style>
            body { font-family: sans-serif; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5 text-center text-primary">ExcelBill</h1>

      {/* Excel Upload */}
      <div className="mb-5 flex items-center space-x-4">
        <Input
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileUpload}
          className="flex-grow"
        />
        <Input
          type="search"
          placeholder="Search table..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Table Display */}
      {excelData.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-md">
          <Table>
            <TableCaption>
              Parsed Excel data displayed in a filterable table.
            </TableCaption>
            <TableHeader>
              <TableRow>
                {tableColumns.map(column => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead className="w-[50px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  {tableColumns.map(column => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrint(row)}
                          className="text-green-500 hover:bg-green-100"
                        >
                          <Icons.print className="h-4 w-4"/>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Print Selection</DialogTitle>
                          <DialogDescription>
                            Select which fields to include in the billing printout.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {selectedRow && Object.keys(selectedRow).map(field => (
                            <div key={field} className="flex items-center space-x-2">
                              <Checkbox
                                id={field}
                                checked={fieldsToPrint.includes(field)}
                                onCheckedChange={() => handlePrintFieldsChange(field)}
                              />
                              <Label htmlFor={field}>{field}</Label>
                            </div>
                          ))}
                        </div>
                        <Button type="button" onClick={printDocument}>
                          Print
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Upload an Excel file to display data.
        </div>
      )}
    </div>
  );
}

