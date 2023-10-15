const fs = require("fs");
const fastcsv = require("fast-csv");
const Contact = require("../models/contactmodel");

async function createCSV() {
  try {
    const contacts = await Contact.find({}).lean().exec();

    if (contacts.length === 0) {
      throw new Error("No contacts found");
    }

    const ws = fs.createWriteStream("contacts.csv");
    fastcsv.write(contacts, { headers: true }).pipe(ws);

    console.log("CSV file created successfully.");
  } catch (error) {
    console.error("Error while creating CSV:", error);
  }
}

module.exports = createCSV;
