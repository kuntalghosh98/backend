const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    const { name, email, mobile, password } = req.body;

  try {
    console.log(email);
    if (!email && !mobile) {
        return res.status(400).json({ msg: 'Email or mobile number is required' });
      }
  console.log("pass1");
    //   const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      console.log("pass2");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("pass3");
    const user = new User({
        name,
        email,
       mobile,
        password: hashedPassword,
      });
      console.log("pass4");
      console.log(user);
    await user.save();
    console.log("pass5");

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
    const { emailOrMobile, password } = req.body;
console.log(emailOrMobile,password);
  try {
    const user = await User.findOne({
        $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
      });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// New function to get user details
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { registerUser, loginUser,getUser };
