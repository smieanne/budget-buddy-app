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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory } from "../types";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, transactionSchema } from "../validations/schema";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import TrainIcon from "@mui/icons-material/Train";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSaveTransaction: (data: Schema) => Promise<void>;
}

type IncomeExpense = "income" | "expense";

const AddExpenseModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSaveTransaction,
}) => {
  const getCurrentDay = () => new Date().toISOString().split("T")[0];

  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
    setValue("category", "");
  };

  interface CategoryItem {
    label: IncomeCategory | ExpenseCategory;
    icon: JSX.Element;
  }

  // 支出用カテゴリ
  const expenseCategories: CategoryItem[] = [
    { label: "家賃", icon: <OtherHousesIcon fontSize="small" /> },
    { label: "光熱費", icon: <TipsAndUpdatesIcon fontSize="small" /> },
    { label: "通信費", icon: <RssFeedIcon fontSize="small" /> },
    { label: "サブスク", icon: <SubscriptionsIcon fontSize="small" /> },
    { label: "食費", icon: <RestaurantIcon fontSize="small" /> },
    { label: "日用品費", icon: <LocalGroceryStoreIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
    { label: "交際費", icon: <LocalCafeIcon fontSize="small" /> },
    { label: "医療費", icon: <VaccinesIcon fontSize="small" /> },
    { label: "美容", icon: <FaceRetouchingNaturalIcon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "被服費", icon: <CheckroomIcon fontSize="small" /> },
    { label: "その他", icon: <AddCircleOutlineIcon fontSize="small" /> },
  ];
  // 収入用カテゴリ
  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <PaidIcon fontSize="small" /> },
    { label: "副収入", icon: <SavingsIcon fontSize="small" /> },
    { label: "その他", icon: <AddCircleOutlineIcon fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: getCurrentDay(),
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        type: "expense",
        date: getCurrentDay(),
        amount: 0,
        category: "",
        content: "",
      });
    }
  }, [open, reset]);

  const currentType = watch("type");

  useEffect(() => {
    const newCategories =
      currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType]);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await onSaveTransaction(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {/* 入力エリアヘッダー */}
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Typography variant="h6">新規登録</Typography>
          {/* 閉じるボタン */}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* フォーム要素 */}
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  color="success"
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
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                fullWidth
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="category-select"
                  label="カテゴリ"
                  error={!!errors.category}
                >
                  {categories.map((category, index) => (
                    <MenuItem value={category.label} key={index}>
                      <Box display="flex" alignItems="center">
                        <ListItemIcon sx={{ minWidth: 0, marginRight: 1 }}>
                          {category.icon}
                        </ListItemIcon>
                        {category.label}
                      </Box>
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
                {...field}
                label="金額"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.amount}
                helperText={errors.amount?.message}
                // {...field}
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                // label="金額"
                // type="number"

                // onChange={(e) => {
                //   const value = e.target.value;
                //   const numberValue = value === "0" ? "" : Number(value);
                //   field.onChange(numberValue);
                // }}
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
                margin="normal"
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          <Button
            variant="contained"
            color={currentType === "income" ? "success" : "error"}
            type="submit"
            fullWidth
          >
            追加
          </Button>
        </form>
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
