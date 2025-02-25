const { response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");




const register = async(req , res = response ) => {

    const { username, name,  password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, name, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
    
}

const login =  async(req , res = response ) => {

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({

            msg: 'Credenciales Incorrectas'
        });
      }
      const token = jwt.sign({ user_id: user.user_id }, 'secretKey', { expiresIn: '4h' });
      res.json({ token, 
          role: user.role,
          name: user.name
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

}

const crearUser =  async(req , res = response ) => {
    
    const { username, password, role , name} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password: hashedPassword, role, name });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    
}

const getUsers =  async(req , res = response ) => {

    try {
        const users = await User.findAll();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
}

const editUser =  async(req , res = response ) => {

    const { id } = req.params;
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).send('User not found.');
      user.username = username;
      user.password = hashedPassword;
      user.role = role;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    
}

const deleteUser = async (req, res = response ) => {

  try {
    const user = await User.destroy({where: {user_id: req.params.id}});
    if(user){
       return res.status(204).json({
          ok: false,
          name: user.name,
          msg: 'El usuario ha sido eliminado'
       })
    }
    } catch (error) {
    console.log(error);
    res.status(500).json({error});
 }


}

module.exports = {
    register,
    login,
    crearUser,
    getUsers,
    editUser,
    deleteUser
}