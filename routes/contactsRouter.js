const express = require("express");
const { encrypt, decrypt } = require("../helpers/cryptfunctions");
const Contact = require("../models/contactmodel");
const createCSV = require("../helpers/db_csv_dump");
const contactRouter = express.Router();

// create a new contact
contactRouter.post("/contacts", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const encryptedFirstName = encrypt(firstName);
    const encryptedLastName = encrypt(lastName);
    const encryptedPhoneNumber = encrypt(phoneNumber);

    const contact = new Contact({
      firstName: encryptedFirstName,
      lastName: encryptedLastName,
      phoneNumber: encryptedPhoneNumber,
    });

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: `Error creating the contact: ${error}` });
  }
});

// get all contacts
contactRouter.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    const decryptedContacts = contacts.map((contact) => ({
      id: contact._id,
      firstName: decrypt(contact.firstName),
      lastName: decrypt(contact.lastName),
      phoneNumber: decrypt(contact.phoneNumber),
    }));
    res.send(decryptedContacts);
  } catch (error) {
    res.status(500).json({ error: `Error fetching contacts ${error}` });
  }
});

// get a single contact
contactRouter.get("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    const decryptedContact = {
      id: contact._id,
      firstName: decrypt(contact.firstName),
      lastName: decrypt(contact.lastName),
      phoneNumber: decrypt(contact.phoneNumber),
    };
    res.send(decryptedContact);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching the contact with that id ${error}` });
  }
});

// update a single contact
contactRouter.get("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber } = req.body;
    const encryptedFirstName = encrypt(firstName);
    const encryptedLastName = encrypt(lastName);
    const encryptedPhoneNumber = encrypt(phoneNumber);
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        phone: encryptedPhoneNumber,
      },
      { new: true }
    );
    res.send(contact);
  } catch (error) {
    res.status(500).json({
      error: `Error while updating the contact with that id ${error}`,
    });
  }
});

// Delete a contact
contactRouter.delete("/contacts:/id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.send({ message: "Contact deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while deleting the contact ${error}` });
  }
});

// create csv dump
contactRouter.get("/", async (req, res) => {
  createCSV();
});

module.exports = contactRouter;
