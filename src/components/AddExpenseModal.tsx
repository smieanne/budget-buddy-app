import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ open, onClose }) => {
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");

  const handleAddExpense = async () => {
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <h2>新規登録</h2>
        <TextField
          label="日付"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <TextField
          label="カテゴリ"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        />
        <TextField
          label="金額"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          label="内容"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddExpense}>
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
