let users = [];
let currentId = 1;

exports.getAllUsers = (req, res) => {
  res.status(200).json(users);
};

exports.getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const newUser = {
    id: currentId++,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
  };

  users[userIndex] = updatedUser;
  res.status(200).json(updatedUser);
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
};

// Only for testing purposes to reset the state
exports._resetState = () => {
  users = [];
  currentId = 1;
};
