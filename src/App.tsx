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
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { formatMonth } from "./utils/formatting";

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

  const handleSaveTransaction = async (transaction: any) => {
    try {
      //firestoreにデータを保存
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
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

  // console.log(monthlyTransactions);

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
            currentDay={currentDay}
            onSaveTransaction={handleSaveTransaction}
          />

          <Grid item xs={4}>
            <MonthSelector
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
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
          />
          {/* <TransactionTable /> */}
        </Container>
      </Box>
    </div>
  );
};

export default App;

// import React from "react";

// import "./App.css";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import NoMatch from "./pages/NoMatch";
// import AppLayout from "./components/layout/AppLayout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AppLayout />}>
//           {" "}
//           {/* 全体のレイアウト（親コンポーネント） */}
//           <Route index element={<Home />} />
//           <Route path="*" element={<NoMatch />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
