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
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "../utils/formatting";
import { financeCalculations } from "../utils/financeCalculations";
import { green, red, grey } from "@mui/material/colors";
import { Transaction } from "../types";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import {
  expenseCategories,
  incomeCategories,
  transactionSchema,
  Schema,
} from "../validations/schema"; // validationsファイルからインポート
import DeleteIcon from "@mui/icons-material/Delete";

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
    format: (value: number) =>
      value.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }),
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: editTransaction || {
      type: "expense",
      date: "",
      amount: 0,
      category: "",
      content: "",
    },
  });

  React.useEffect(() => {
    if (editTransaction) {
      reset(editTransaction);
    }
  }, [editTransaction, reset]);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const updatedTransaction: Transaction = {
      ...editTransaction,
      ...data,
      type: transactionType, // Ensure the type is correctly updated
      amount: Number(data.amount), // Ensure amount is a number
    } as Transaction;

    await onDeleteTransaction(editTransaction!.id);
    await onSaveTransaction(updatedTransaction);

    setMonthlyTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    handleClose();
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

  const handleTransactionTypeChange = (type: "expense" | "income") => {
    setTransactionType(type);
    setValue("category", ""); // カテゴリをリセットしてバリデーションをトリガー
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
                onClick={() => handleTransactionTypeChange("expense")}
                fullWidth
              >
                支出
              </Button>
              <Button
                variant={
                  transactionType === "income" ? "contained" : "outlined"
                }
                color="primary"
                onClick={() => handleTransactionTypeChange("income")}
                fullWidth
              >
                収入
              </Button>
            </ButtonGroup>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="日付"
                  type="date"
                  fullWidth
                  margin="normal"
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="カテゴリ"
                  select
                  fullWidth
                  margin="normal"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  {currentCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="金額"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10) || 0;
                    field.onChange(newValue);
                  }}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="内容"
                  fullWidth
                  margin="normal"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />
            <Button
              type="submit"
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
          </form>
          <Button
            type="submit"
            onClick={handleDelete}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            fullWidth
          >
            <DeleteIcon />
            削除
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}
