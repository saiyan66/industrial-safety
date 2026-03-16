import bcrypt from "bcryptjs";

const password = "54321"; 
const hash = await bcrypt.hash(password, 10);
console.log(hash);