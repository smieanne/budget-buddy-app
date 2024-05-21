import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React from "react";
import { ja } from "date-fns/locale/ja";

const MonthSelrctor = () => {
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

export default MonthSelrctor;