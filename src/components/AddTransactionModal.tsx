import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  ButtonGroup,
  MenuItem,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { Controller, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory } from "../types";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, transactionSchema } from "../validations/schema";

// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  currentDay: string;
  onSaveTransaction: (data: any) => void;
}

type IncomeExpense = "income" | "expense";

const AddExpenseModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  currentDay,
  onSaveTransaction,
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay, //後で修正
      amount: 0,
      category: "",
      content: "test",
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);

  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");

  // const currentDate = new Date().toISOString().split("T")[0];

  const handleAddTransaction = async () => {
    await addDoc(collection(db, "Transactions"), {
      date,
      category,
      amount: Number(amount),
      description,
    });
    setDate("");
    setCategory("");
    setAmount("");
    setDescription("");
    onClose();
  };

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
  };

  //収支タイプを監視
  const currentType = watch("type");
  // console.log(currentType);

  useEffect(() => {
    const newCategories =
      currentType === "expense" ? expenseCategories : incomeCategories;
    // console.log(newCategories);
    setCategories(newCategories);
  }, [currentType]);

  //送信処理
  const onSubmit = (data: any) => {
    onSaveTransaction(data);
  };

  type IncomeExpense = "income" | "expense";
  interface CategoryItem {
    label: IncomeCategory | ExpenseCategory;
    icon: JSX.Element;
  }

  // 支出用カテゴリ
  const expenseCategories: CategoryItem[] = [
    { label: "家賃", icon: <FastfoodIcon fontSize="small" /> },
    { label: "光熱費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "通信費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "サブスク", icon: <FastfoodIcon fontSize="small" /> },
    { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "日用品費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "交通費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "交際費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "医療費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "美容", icon: <FastfoodIcon fontSize="small" /> },
    { label: "被服費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "その他", icon: <FastfoodIcon fontSize="small" /> },
  ];
  // 収入用カテゴリ
  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <FastfoodIcon fontSize="small" /> },
    { label: "副収入", icon: <FastfoodIcon fontSize="small" /> },
    { label: "その他", icon: <FastfoodIcon fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);

  return (
    <Modal open={open} onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
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
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
        />
        {/* カテゴリ */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="category-select-label">カテゴリ</InputLabel>
              <Select
                {...field}
                labelId="category-select-label"
                id="category-select"
                label="カテゴリ"
              >
                {categories.map((category, index) => (
                  <MenuItem value={category.label} key={index}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>
          )}
        />
        {/* 金額 */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              error={!!errors.amount}
              helperText={errors.amount?.message}
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
              error={!!errors.content}
              helperText={errors.content?.message}
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
