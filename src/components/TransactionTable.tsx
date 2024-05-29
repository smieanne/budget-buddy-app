import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Typography,
  Button,
  ButtonGroup,
  Modal,
  Box,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { formatCurrency } from "../utils/formatting";
import { financeCalculations } from "../utils/financeCalculations";
import { green, red, grey } from "@mui/material/colors";
import { Transaction } from "../types";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { expenseCategories, incomeCategories } from "../validations/schema"; // validationsファイルからインポート

interface TransactionTableProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Transaction) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

interface Column {
  id: keyof Transaction;
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "date", label: "日付", minWidth: 170 },
  { id: "category", label: "カテゴリ", minWidth: 100 },
  {
    id: "amount",
    label: "金額",
    minWidth: 170,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  { id: "content", label: "内容", minWidth: 170, align: "left" },
];

function FinancialItem({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
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
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransactionTable({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
}: TransactionTableProps) {
  const [MonthlyTransactions, setMonthlyTransactions] =
    React.useState<Transaction[]>(monthlyTransactions);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editTransaction, setEditTransaction] =
    React.useState<Transaction | null>(null);
  const [transactionType, setTransactionType] = React.useState<
    "expense" | "income"
  >("expense");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setTransactionType(transaction.type); // タイプを設定
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (editTransaction) {
      const updatedTransaction: Transaction = {
        ...editTransaction,
        amount: Number(editTransaction.amount), // Ensure amount is a number
        type: transactionType, // タイプの変更を反映
      };
      // Delete the old transaction
      await onDeleteTransaction(editTransaction.id);
      // Save the updated transaction
      await onSaveTransaction(updatedTransaction);
      // Update the state
      setMonthlyTransactions((prev) =>
        prev.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (editTransaction) {
      await onDeleteTransaction(editTransaction.id);
      setMonthlyTransactions((prev) =>
        prev.filter((t) => t.id !== editTransaction.id)
      );
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editTransaction) {
      const { name, value } = e.target;
      setEditTransaction({
        ...editTransaction,
        [name]: name === "amount" ? Number(value) : value,
      });
    }
  };

  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  // Sort transactions by date in descending order (newest first)
  const sortedTransactions = [...monthlyTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentCategories =
    transactionType === "expense" ? expenseCategories : incomeCategories;

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
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
                  key={column.id as string}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={transaction.id}
                  onClick={() => handleOpen(transaction)}
                >
                  {columns.map((column) => {
                    const value = transaction[column.id];
                    return (
                      <TableCell key={column.id as string} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sortedTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              修正 / 削除
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box mb={2}>
            <ButtonGroup fullWidth>
              <Button
                variant={
                  transactionType === "expense" ? "contained" : "outlined"
                }
                color="error"
                onClick={() => setTransactionType("expense")}
                fullWidth
              >
                支出
              </Button>
              <Button
                variant={
                  transactionType === "income" ? "contained" : "outlined"
                }
                color="primary"
                onClick={() => setTransactionType("income")}
                fullWidth
              >
                収入
              </Button>
            </ButtonGroup>
          </Box>
          <TextField
            label="日付"
            type="date"
            name="date"
            value={
              editTransaction
                ? format(new Date(editTransaction.date), "yyyy-MM-dd")
                : ""
            }
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="カテゴリ"
            name="category"
            value={editTransaction ? editTransaction.category : ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            select
          >
            {currentCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="金額"
            name="amount"
            value={editTransaction ? editTransaction.amount : ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="内容"
            name="content"
            value={editTransaction ? editTransaction.content : ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "green",
              "&:hover": { bgcolor: "darkgreen" },
            }}
            fullWidth
          >
            更新
          </Button>

          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            fullWidth
          >
            削除
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}
