import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import Header from "./components/Header";
import ExpenseTable from "./components/ExpenseTable";
import AddExpenseModal from "./components/AddTransactionModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MonthSelector from "./components/MonthSelector";
import TransactionTable from "./components/TransactionTable";
import AddTransactionModal from "./components/AddTransactionModal";
import { format } from "date-fns";
import { Transaction } from "./types/index";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function isFireStoreError(
    err: unknown
  ): err is { code: string; message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      "message" in err
    );
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = format(currentMonth, "yyyy-MM");
  const [currentDay, setCurrentDay] = useState(today);

  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Transactions"));
      const transactionsData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as Transaction;
      });
      setTransactions(transactionsData);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log("FireStoreのエラーは:", err);
        console.log(err.message);
        console.log(err.code);
      } else {
        console.log("一般的なエラーは:", err);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions([...transactions, newTransaction]);
      await fetchTransactions(); // Fetch the updated transactions
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log("FireStoreのエラーは:", err);
        console.log(err.message);
        console.log(err.code);
      } else {
        console.log("一般的なエラーは:", err);
      }
    }
  };

  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "Transactions", id));
      }
      await fetchTransactions(); // Fetch the updated transactions
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  const updateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);

      const updatedTransaction = {
        ...transaction,
        id: transactionId,
      } as Transaction;

      setTransactions((prevTransactions) =>
        prevTransactions.map((t) =>
          t.id === transactionId ? updatedTransaction : t
        )
      );

      // Fetch the updated transactions to ensure consistency
      await fetchTransactions();
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  return (
    <div>
      <Header openModal={openModal} />
      <Box
        sx={{
          display: { md: "flex" },
          bgcolor: "#fffdf1",
          minHeight: "100vh",
        }}
      >
        <Container>
          <ExpenseTable />
          <AddTransactionModal
            open={isModalOpen}
            onClose={closeModal}
            onSaveTransaction={handleSaveTransaction}
          />
          <Grid item xs={4}>
            <MonthSelector
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              onSaveTransaction={handleSaveTransaction}
            />
          </Grid>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "#FFD700",
              color: "#000",
              "&:hover": { backgroundColor: "#FFD700" },
              mb: 1,
            }}
            onClick={openModal}
          >
            新規登録
          </Button>
          <TransactionTable
            monthlyTransactions={monthlyTransactions}
            setCurrentMonth={setCurrentMonth}
            onSaveTransaction={handleSaveTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            // fetchTransactions={fetchTransactions}
            updateTransaction={updateTransaction}
          />
        </Container>
      </Box>
    </div>
  );
};

export default App;
