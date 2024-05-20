import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { styled } from "@mui/system";

interface HeaderProps {
  openModal: () => void;
}

const HeaderBar = styled(AppBar)({
  backgroundColor: "#213356",
});

const Header: React.FC<HeaderProps> = ({ openModal }) => {
  return (
    <HeaderBar position="static">
      <Toolbar>
        <Avatar src="/assets/Bee.jpg" sx={{ marginRight: 2 }} />
        {/* 画像をroundedに表示 */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Budget Buddy
        </Typography>
        {/* <Button color="inherit" onClick={openModal}>
          新規登録
        </Button> */}

        {/* <Button variant="contained">Contained</Button> */}
      </Toolbar>
    </HeaderBar>
  );
};

export default Header;
