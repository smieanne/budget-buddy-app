import React from "react";
import { ExpenseCategory, IncomeCategory } from "../../types";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  家賃: <OtherHousesIcon fontSize="small" />,
  光熱費: <TipsAndUpdatesIcon fontSize="small" />,
  通信費: <RssFeedIcon fontSize="small" />,
  サブスク: <SubscriptionsIcon fontSize="small" />,
  食費: <RestaurantIcon fontSize="small" />,
  日用品費: <LocalGroceryStoreIcon fontSize="small" />,
  交通費: <TrainIcon fontSize="small" />,
  交際費: <LocalCafeIcon fontSize="small" />,
  医療費: <VaccinesIcon fontSize="small" />,
  美容: <FaceRetouchingNaturalIcon fontSize="small" />,
  娯楽: <SportsTennisIcon fontSize="small" />,
  被服費: <CheckroomIcon fontSize="small" />,
  その他: <AddCircleOutlineIcon fontSize="small" />,

  給与: <PaidIcon fontSize="small" />,
  副収入: <SavingsIcon fontSize="small" />,
  // その他:  <AddCircleOutlineIcon fontSize="small" /> ,
};

export default IconComponents;
