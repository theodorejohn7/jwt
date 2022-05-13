const express = require("express");

const app = express();

const cors = require("cors");
 




// const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
credentials:true,          
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
 
 

////////////////////////////////////

app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

app.listen(5000, () => {
  console.log("listening on port 5000");
});
