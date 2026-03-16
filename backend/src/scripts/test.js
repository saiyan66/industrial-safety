import bcrypt from "bcryptjs";

const typed    = "12345";  
const stored   = "$2b$10$RSq3pMEqeQMLOZpT18SuP.6Dv3MvjrX.DqV.rXWX8NWs1ecAEC45e";

const match = await bcrypt.compare(typed, stored);
console.log("Match:", match); 