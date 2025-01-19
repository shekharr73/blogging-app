const { Router } = require("express");
const User = require("../model/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await User.create({
      fullName,
      email,
      password
    });

    // Optionally, you can check the password here if needed
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);

    return res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
