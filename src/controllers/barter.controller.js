import BarterItem from "../models/barter.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";


export const listBarterItem = async (req, res) => {
    try {
      const { itemName, description, image, wantedItemDescription, phone } = req.body;
      
  
      // Check if required fields are provided
      if (!itemName || !description || !wantedItemDescription || !phone || !image) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Validate phone number (exactly 10 digits)
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: "Phone number must be exactly 10 digits." });
      }

      if (wantedItemDescription.length > 50) {
        return res.status(400).json({ error: "Wanted item description must not exceed 50 characters." });
      }

      const uploadImageResponse = await cloudinary.uploader.upload(image);
      
  
      const barterItem = new BarterItem({
        owner: req.user._id,
        itemName,
        description,
        image:uploadImageResponse.secure_url,
        wantedItemDescription,
        phone, // Only phone inside contactInfo
      });
  
      await barterItem.save();
      res.status(201).json({ message: "Barter item listed successfully.", barterItem });
    } catch (error) {
      console.error("Error listing barter item:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  export const getBarterItems = async (req, res) => {
    try {
      const barterItems = await BarterItem.find({ status: "active" })
        .populate("owner", "username"); // Populate only the name
  
      if (barterItems.length === 0) {
        return res.status(404).json({ message: "No barter items found." });
      }
  
      res.status(200).json(barterItems);
    } catch (error) {
      console.error("Error fetching barter items:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  export const delistBarterItem = async (req, res) => {
    try {
      const barterItem = await BarterItem.findById(req.params.id);
  
      if (!barterItem) {
        return res.status(404).json({ error: "Barter item not found." });
      }
  
      if (barterItem.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized to delist this item." });
      }
  
      barterItem.status = "delisted";
     const delistedItem = await barterItem.save();
  
      res.status(200).json({ message: "Barter item delisted successfully." ,delistedItem });
    } catch (error) {
      console.error("Error delisting barter item:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  