const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

exports.login = asyncHandler(async (req, res) => {

  console.log("req.body", req.body);
  
  const result = await authService.login(req.body);
  res.json(result);
});
