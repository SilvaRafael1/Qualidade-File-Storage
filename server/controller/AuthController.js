const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
require("dotenv/config")

module.exports = {
  async auth(req, res) {
    try{
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) return res.status(400).send("Usuário ou senha incorreta.");
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send("Usuário ou senha incorreta.");
  
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: '30s'
      });
      
      res.send({ token, role: user.role });
    } catch (e) {
      console.error(e)
    }
  },

  async register(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        username,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      res.json({
        message: "User registered successfully",
        userId: savedUser._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}