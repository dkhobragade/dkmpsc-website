import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/user/dashboard", protect, authorize(["user"]), (req, res) => {
  res.status(200).json({
    success: true,
    message: "User dashboard data",
    data: {
      stats: "User stats coming soon",
    },
  });
});

router.get("/admin/dashboard", protect, authorize(["admin"]), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin dashboard data",
    data: {
      stats: "Admin stats coming soon",
    },
  });
});

export default router;
