const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Search users
const searchUsers = async (req, res) => {
  const query = req.query.query;
  try {
    const users = await User.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ],
    }).select('_id name');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if all fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please fill all fields' });
      }
  
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'User Already Exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create and save the new user
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      // Respond with success message
      res.status(201).json({ message: 'User created' });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


const loginUser = async (req, res) => {
      const { name,email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && ( await bcrypt.compare(password,user.password)))
      {
        res.status(201).json({ message: 'Login successfully',
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        });

      }
      else{
        res.status(400).json({ message: 'Invalid informations' })
      }

  };
const getMe = async (req, res) => {
    const {_id,name,email}= await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        name,
        email,
    })
    // res.json({message:"Data user display"})
}



const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
module.exports = {
  registerUser,
  loginUser,
  getMe,
  searchUsers
};