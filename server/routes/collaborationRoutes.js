const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  sendRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  getSentRequests,
} = require(
  "../controllers/collaborationController"
);

//
// SEND REQUEST
//
router.post(
  "/send",
  protect,
  sendRequest
);

//
// GET RECEIVED REQUESTS
//
router.get(
  "/received",
  protect,
  getMyRequests
);

//
// GET SENT REQUESTS
//
router.get(
  "/sent",
  protect,
  getSentRequests
);

//
// ACCEPT REQUEST
//
router.put(
  "/accept/:id",
  protect,
  acceptRequest
);

//
// REJECT REQUEST
//
router.put(
  "/reject/:id",
  protect,
  rejectRequest
);

module.exports = router;