import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { WidthFull } from "@mui/icons-material";

interface Column {
  id: "name" | "code" | "population" | "size";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "name", label: "日付", minWidth: 170 },
  { id: "code", label: "カテゴリ", minWidth: 100 },
  {
    id: "population",
    label: "金額",
    minWidth: 170,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "内容",
    minWidth: 170,
    align: "left",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
  // {
  //   id: "density",
  //   label: "Density",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toFixed(0),
  // },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: string;
  // density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: string
  // density: string
): Data {
  // const density = population / size;
  return { name, code, population, size };
}

const rows = [
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
];

export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={1} sx={{ color: "green" }}>
                収入：300,000
              </TableCell>
              <TableCell align="center" colSpan={2} sx={{ color: "red" }}>
                支出：100,000
              </TableCell>
              <TableCell align="center" colSpan={2}>
                残高：200,000
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
