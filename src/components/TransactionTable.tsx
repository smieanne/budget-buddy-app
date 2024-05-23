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
import { Grid, Typography } from "@mui/material";
import { formatCurrency } from "../utils/formatting";
import { financeCalculations } from "../utils/financeCalculations";
import { blue, green, red, grey } from "@mui/material/colors";
import { Schema } from "zod";

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
  createData("2024/5/1", "家賃", 1000, "食材買い出し"),
  createData("2024/5/1", "食費", 1000, "食材買い出し"),
  createData("2024/5/1", "美容", 1000, "食材買い出し"),
];
interface ReportProps {
  monthlyTransactions: Schema[];
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
}

export default function TransactionTable({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
}: any) {
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

  interface FinacialItemProps {
    title: string;
    value: number;
    color: string;
  }
  function FinancialItem({ title, value, color }: FinacialItemProps) {
    return (
      // <Grid item xs={4} textAlign={"center"}>
      //   <Typography variant="subtitle1" component={"div"}>
      //     {title}{" "}
      //   </Typography>

      <Typography
        component={"span"}
        fontWeight={"fontWeightBold"}
        sx={{
          color: color,
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
          wordBreak: "break-word",
        }}
      >
        {title} ¥{formatCurrency(value)}
      </Typography>
      // </Grid>
    );
  }

  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {/*収支表示エリア */}
            {/* <Grid
              container
              sx={{ borderBottom: "1px solid rgba(224, 224,224,1)" }}
            ></Grid> */}

            <TableRow>
              <TableCell align="center" colSpan={1}>
                <FinancialItem
                  title={"収入"}
                  value={income}
                  color={green[800]}
                />
              </TableCell>
              <TableCell align="center" colSpan={2}>
                <FinancialItem
                  title={"支出"}
                  value={expense}
                  color={red[800]}
                />
              </TableCell>
              <TableCell align="center" colSpan={2}>
                <FinancialItem
                  title={"残高"}
                  value={balance}
                  color={grey[900]}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    // background: "#dedede",
                    fontWeight: "bold",
                  }}
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
        count={monthlyTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
