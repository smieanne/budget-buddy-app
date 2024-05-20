import React, { useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import Header from "./components/Header";
import ExpenseTable from "./components/ExpenseTable";
import AddExpenseModal from "./components/AddExpenseModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import MonthSelrctor from "./components/MonthSelector";
import TransactionTable from "./components/TransactionTable";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div>
      <Header openModal={openModal} />
      <Box
        sx={{
          display: { md: "flex" },
          bgcolor: "#e4e7ec",
          minHeight: "100vh",
        }}
      >
        <Container>
          <ExpenseTable />
          <AddExpenseModal open={isModalOpen} onClose={closeModal} />

          <Grid item xs={4}>
            <MonthSelrctor />
          </Grid>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "#213356",
              "&amp;:hover": { backgroundColor: "#0a1d42" },
              mb: 2,
            }}
            onClick={openModal}
          >
            新規登録
          </Button>

          <TransactionTable />
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
