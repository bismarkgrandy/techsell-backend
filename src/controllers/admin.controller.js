import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import BarterItem from "../models/barter.model.js";

export const getPendingProducts = async (req, res) => {
    try {
      const pendingProducts = await Product.find({ status: "pending" });
  
      res.status(200).json({ products: pendingProducts });
    } catch (error) {
      console.error("Error fetching pending products:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

export const approveProduct = async (req, res) => {
  try {
    const productId = req.params.id;  // Extract product ID
    const { status } = req.body;  // Get status from request body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Choose 'approved' or 'rejected'." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product.status = status;
    await product.save();

    res.status(200).json({ message: `Product ${status} .` });
  } catch (error) {
    console.error("Error approving product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Choose 'approved' or 'rejected'." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.sellerStatus !== "pending") {
      return res.status(400).json({ error: "User has not applied to be a seller." });
    }
    
    user.roles.push("seller");
    user.sellerStatus = status;
    await user.save();

    res.status(200).json({ message: `Seller status ${status}.` });
  } catch (error) {
    console.error("Error approving seller:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const approveDeliveryPersonnel = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Choose 'approved' or 'rejected'." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.deliveryStatus !== "pending") {
      return res.status(400).json({ error: "User has not applied to be a delivery personnel." });
    }
    
    user.roles.push("delivery");
    user.deliveryStatus = status;
    await user.save();

    res.status(200).json({ message: `Delivery personnel status ${status}.` });
  } catch (error) {
    console.error("Error approving delivery personnel:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getApprovedDeliveryPersonnel = async (req, res) => {
  try {
    const deliveryPersonnel = await User.find({ roles: "delivery", deliveryStatus: "approved" });

    res.status(200).json({ deliveryPersonnel });

  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({  sellerStatus: "pending" });

    res.status(200).json({ sellers });

  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingDeliveryPersonnels = async (req, res) => {
  try {
    const deliveryPersonnel = await User.find({ deliveryStatus: "pending" });

    res.status(200).json({ deliveryPersonnel });

  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDeliveryCounts = async (req, res) => {
  try{
    const deliveryCounts = await Order.aggregate([
      { $match: { status: "delivered" } }, // Filter delivered orders
      {
        $lookup: {
          from: "users", // The collection to join with (User collection)
          localField: "deliveryPersonnel", // Field in the Order collection
          foreignField: "_id", // Field in the User collection
          as: "deliveryPersonnelDetails" // Output array field
        }
      },
      { $unwind: "$deliveryPersonnelDetails" }, // Unwind the joined array
      {
        $group: {
          _id: {
            id: "$deliveryPersonnel", // Include the ID
            username: "$deliveryPersonnelDetails.username" // Include the name
          },
          totalDeliveries: { $sum: 1 } // Count deliveries
        }
      }
    ]);

    res.status(200).json({ deliveryCounts });

  } catch(error) {
    console.error("Error fetching delivery counts:", error);
    res.status(500).json({ message: "Server error" });

  }
}


 export const adminDelistBarterItem = async (req, res) => {
    try {
      const barterItem = await BarterItem.findByIdAndDelete(req.params.id)
  
      res.status(200).json({ message: "Barter item deleted successfully."  });
    } catch (error) {
      console.error("Error deleting barter item:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  
 