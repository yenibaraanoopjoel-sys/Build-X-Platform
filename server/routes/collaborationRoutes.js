const express =
  require("express");

const router =
  express.Router();

//
// MIDDLEWARE
//
const protect =
  require(
    "../middleware/authMiddleware"
  );

//
// CONTROLLERS
//
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
// SEND COLLABORATION REQUEST
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

//
// HEALTH CHECK ROUTE
//
router.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Collaboration routes working 🚀",
    });
  }
);

module.exports = router;