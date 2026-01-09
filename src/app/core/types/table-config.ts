export interface TableConfig {
  sort: {
    field: string;
    order: 1 | -1;
  };
  pagination: {
    rows: number;
    options: number[];
  };
}
