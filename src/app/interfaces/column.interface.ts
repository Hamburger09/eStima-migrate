export interface TableColumn {
  label: string; // translation key
  key: string; // dataField
  required?: boolean;
  editable?: boolean;
  dataType?: string; // string, number, boolean, date, etc.
  editorType?: string; // dxTextBox, dxSelectBox, dxSwitch, etc.
  editorOptions?: any;
  lookup?: {
    dataSource: any[] | ((options?: any) => any[]);
    valueExpr: string;
    displayExpr: string;
  };

  valueGetter?: (row: any) => any; // for display only
  displayGetter?: (row: any) => string; // optional formatting
  calculateDisplayValue?: (row: any) => any;

  setCellValue?: (row: any, value: any) => void;
  calculateCellValue?: (row: any) => any;
  cellTemplate?: (container: any, options: any) => void;
}
