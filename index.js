const mongoose = require("mongoose");
const body = require("body-parser");
const express = require("express");
const { Expense } = require("./schema.js");
const app = express();
app.use(body.json());
app.post("/add-expense", async (request, response) => {
  try {
    await Expense.create({
      amount: request.body.amount,
      date: request.body.date,
      title: request.body.title,
    });
    response.status(201).json({
      status: "success",
      message: "Entry",
    });
  } catch (error) {
    response.status(500).json({
      status: "Failure",
      message: "Entry not successful",
      error: error,
    });
  }
});
app.get("/view-expenses", async (request, response) => {
  try {
    const expenseData = await Expense.find();
    response.json(expenseData);
  } catch (error) {
    response.status(500).json({ status: "Error", message: "Couldnt retrieve" });
  }
});

app.delete("/delete-expense/:id", async function (request, response) {
  try {
    const expenseEntry = await Expense.findById(request.params.id);
    if (expenseEntry) {
      await Expense.findByIdAndDelete(request.params.id);
      response.status(200).json({
        status: "success",
        message: "successfully deleted the entry",
      });
    } else {
      response.status(404).json({
        status: "failure",
        message: "could not find the entry",
      });
    }
  } catch (error) {
    response.status(500).json({
      status: "failure",
      message: "could not delete entry",
      error: error,
    });
  }
});

app.patch("/update-expense/:id", async function (request, response) {
  try {
    const expenseEntry = await Expense.findById(request.params.id);
    if (expenseEntry) {
      await expenseEntry.updateOne({
        amount: request.body.amount,
        title: request.body.title,
        date: request.body.date,
      });
      response.status(200).json({
        status: "success",
        message: "successfully updated the entry",
      });
    } else {
      response.status(404).json({
        status: "failure",
        message: "could not find the entry",
      });
    }
  } catch (error) {
    response.status(500).json({
      status: "failure",
      message: "could not update entry",
      error: error,
    });
  }
});

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://tabaswini12:tabu@cluster0.nqcnlws.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB connection established");

    const port = process.env.port || 8000;

    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Coludn't establish connection");
  }
}

connectToDb();

module.exports = { Expense };
