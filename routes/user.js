const { Router } = require("express");
const User = require("../model/user")

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (res, req) => {
  return res.render("signup");
});

router.post('/signup'), async(req, res) => {
    const { fullname, email, password} = req.body;
    await User.create({
        fullname,
        email,
        password
    })
}