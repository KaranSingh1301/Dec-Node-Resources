const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Cal is working");
});

//addition api
//num1 ,num2
app.post("/add", (req, res) => {
  console.log(req.body);
  const { num1, num2 } = req.body;

  //data validation
  if (!num1 || !num2) {
    return res.send("Data is missing");
  }

  console.log(typeof num1);
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res.send("Data type of numbers are incorrect");
  }

  const result = num1 + num2;

  return res.send({
    status: 200,
    message: "Addition is successfull",
    data: result,
  });
});

//subtract
//query
//  /sub?num1=100&num2=200
app.post("/sub", (req, res) => {
  const num1 = Number(req.query.num1);
  const num2 = parseInt(req.query.num2);

  const result = Math.abs(num1 - num2);

  return res.send({
    status: 200,
    message: "Sub success",
    data: result,
  });
});

//mul, div
// app.get('/mul/:id1/:id2')

app.listen(PORT, () => {
  console.log(`calculator is running on PORT:${PORT}`);
});
