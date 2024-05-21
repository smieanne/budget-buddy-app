import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { Controller, useForm } from "react-hook-form";

// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  currentDay: string;
}

type IncomeExpense = "income" | "expense";

const AddExpenseModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  currentDay,
}) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      type: "expense",
      date: currentDay, //後で修正
      amount: 0,
      category: " ",
      content: "test",
    },
  });

  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");

  // const currentDate = new Date().toISOString().split("T")[0];

  const handleAddTransaction = async () => {
    // await addDoc(collection(db, "expenses"), {
    //   date,
    //   category,
    //   amount: Number(amount),
    //   description,
    // });
    setDate("");
    setCategory("");
    setAmount("");
    setDescription("");
    onClose();
  };

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
  };

  const currentType = watch("type");
  console.log(currentType);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {/* 入力エリアヘッダー */}
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Typography variant="h6">新規登録</Typography>
          {/* 閉じるボタン */}
          <IconButton
            onClick={onClose}
            // sx={{
            //   color: (theme) => theme.palette.grey[500],
            // }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* フォーム要素 */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <ButtonGroup fullWidth>
              <Button
                variant={field.value === "expense" ? "contained" : "outlined"}
                color="error"
                onClick={() => incomeExpenseToggle("expense")}
              >
                支出
              </Button>
              <Button
                onClick={() => incomeExpenseToggle("income")}
                color="primary"
                variant={field.value === "income" ? "contained" : "outlined"}
              >
                収入
              </Button>
            </ButtonGroup>
          )}
        />

        {/* 日付 */}
        <Controller
          name="date"
          control={control}
          render={(field) => (
            <TextField
              {...field}
              label="日付"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="カテゴリ"
              label="カテゴリ"
              fullWidth
              // value={"食費"}
              // onChange={(e) => setCategory(e.target.value)}
              margin="normal"
            />
          )}
        />
        {/* 金額 */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="金額"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
            />
          )}
        />
        {/* 内容 */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="内容"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
          )}
        />

        <Button
          variant="contained"
          color={currentType === "income" ? "primary" : "error"}
          onClick={handleAddTransaction}
        >
          追加
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default AddExpenseModal;
