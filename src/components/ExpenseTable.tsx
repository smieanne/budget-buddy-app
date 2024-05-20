import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const ExpenseTable: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      // const querySnapshot = await getDocs(collection(db, "expenses"));
      // const expensesData = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // })) as Expense[];
      // setExpenses(expensesData);
    };

    fetchExpenses();
  }, []);

  return (
    <TableContainer component={Paper}>
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell>日付</TableCell>
            <TableCell>カテゴリ</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>内容</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </TableContainer>
  );
};

export default ExpenseTable;
