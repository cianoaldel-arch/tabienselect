const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { sign } = require('../utils/jwt');
const HttpError = require('../utils/HttpError');

async function login({ email, password }) {

  console.log("email",email);
  console.log("password",password);

//   await prisma.adminUser.create({
//   data: {
//     email: "admin@test.com",
//     password_hash: await bcrypt.hash("ฟ/1234", 10)
//   }
// });

  const user = await prisma.adminUser.findUnique({ where: { email } });
// console.log("user",user);

  
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.password_hash);

  // console.log("ok",ok);

  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const token = sign({ sub: user.id, email: user.email, role: 'admin' });

    console.log("token",token);

  return { token, user: { id: user.id, email: user.email } };
}

module.exports = { login };
