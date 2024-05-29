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

  //FireStoreのエラーかどうかを判定する型ガード
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

  const [taransactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = format(currentMonth, "yyyy-MM");
  //日付のフォーマット

  const [currentDay, setCurrentDay] = useState(today);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        // console.log(querySnapshot);

        const transactionsData = querySnapshot.docs.map((doc) => {
          // console.log(doc.id, " => ", doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });

        // console.log(transactionsData);
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
    fetchTransactions();
  }, []);

  //ひと月分のデータのみ取得
  const monthlyTransactions = taransactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      //firestoreにデータを保存
      const docRef = await addDoc(collection(db, "Transactions"), transaction);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      console.log(newTransaction);
      setTransactions([...taransactions, newTransaction]);
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

  //削除処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];

      for (const id of idsToDelete) {
        //firestoreのデータ削除
        await deleteDoc(doc(db, "Transactions", id));
      }
      //複数の取引を削除可能
      // const filterdTransactions = transactionSchema.filter(
      //   (Transaction) => !idsToDelete.includes(Transaction.id)
      // );
      // setTransactions(filterdTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  //更新処理
  const dateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      //firestore更新処理
      const docRef = doc(db, "Transactions", transactionId);

      await updateDoc(docRef, transaction);
      //フロント更新
      const updateTransactions = taransactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updateTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  // console.log(monthlyTransactions);

  //追加
  const onSaveTransaction = async (
    transaction: Schema
  ): Promise<Transaction> => {
    const docRef = await addDoc(collection(db, "Transactions"), transaction);
    const newTransactionDoc = await getDoc(docRef);
    return {
      id: newTransactionDoc.id,
      ...newTransactionDoc.data(),
    } as Transaction;
  };

  return (
    <div>
      <Header openModal={openModal} />
      <Box
        sx={{
          display: { md: "flex" },
          bgcolor: "#fffdf1", //#fbf9e1　　黄色#FFF8DC
          minHeight: "100vh",
        }}
      >
        <Container>
          <ExpenseTable />
          <AddTransactionModal
            open={isModalOpen}
            onClose={closeModal}
            // currentDay={currentDay}
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
              // backgroundColor: "#213356",
              backgroundColor: "#FFD700",
              color: "#000",
              "&amp;:hover": { backgroundColor: "#FFD700" },
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
            // onUpdateTransaction={handleUpdateTransaction}
          />
          {/* <TransactionTable /> */}
        </Container>
      </Box>
    </div>
  );
};

export default App;
