import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React from "react";
import { ja } from "date-fns/locale/ja";
import { addMonths, set } from "date-fns";
import { Schema } from "../validations/schema";

interface MonthSelectorProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
}: MonthSelectorProps) => {
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };
  //先月ボタンを押した時の処理
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    setCurrentMonth(previousMonth);
  };

  //次月ボタンを押した時の処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
      dateFormats={{ year: "yyyy年", month: "MM月" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <Button
          onClick={handlePreviousMonth}
          variant="contained"
          sx={{
            backgroundColor: "#3e3d37",
            // color: "black",
            "&amp;:hover": {
              backgroundColor: "#25241d", // ホバー時の背景色
            },
          }}
        >
          先月
        </Button>
        <DatePicker
          onChange={handleDateChange}
          value={currentMonth}
          label="年月を選択"
          sx={{ mx: 2, background: "white" }}
          views={["year", "month"]}
          format="yyyy/MM"
          slotProps={{
            toolbar: {
              toolbarFormat: "yyyy年MM月",
            },
          }}
        />
        <Button
          onClick={handleNextMonth}
          variant="contained"
          sx={{
            backgroundColor: "#3e3d37", //#f0b800
            // color: "black",
            "&amp;:hover": {
              backgroundColor: "#25241d", // ホバー時の背景色
            },
          }}
        >
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
