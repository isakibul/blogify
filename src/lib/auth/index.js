const { userExits, createUser, findUserByEmail } = require("../user");
const { badRequest } = require("../../utils/error");
const { generateHash, hashMatched } = require("../../utils/hashing");
const { generateToken } = require("../token");

const register = async ({ name, email, password }) => {
  const hashUser = await userExits(email);

  if (hashUser) {
    throw badRequest("User already exists");
  }

  password = await generateHash(password);

  const user = await createUser({ name, email, password });

  return user;
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw badRequest("Invalid credentials");
  }

  const matched = await hashMatched(password, user.password);
  if (!matched) {
    throw badRequest("Invalid credentials");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};

module.exports = {
  register,
  login,
};
