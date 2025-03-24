import { config } from "dotenv";
import { connectDB } from "./lib/db.js";
import Product from "./models/product.model.js";

config();

const products =[
    {
      "seller": "67d6ad2e23879bc80d3852f4",
      "name": "Black & Brown Slipper",
      "description": "The Black & Brown Slipper is a comfortable and stylish choice for casual wear. Featuring a blend of black and brown colors, it adds a touch of sophistication to your relaxation.",
      "price": 19.99,
      "image": "https://cdn.dummyjson.com/products/images/womens-shoes/Black%20&%20Brown%20Slipper/1.png",
      "category": "clothing",
      "status": "approved",
      "featured": false
    },
    {
      "seller": "67d6ad2e23879bc80d3852f4",
      "name": "Calvin Klein Heel Shoes",
      "description": "Calvin Klein Heel Shoes are elegant and sophisticated, designed for formal occasions. With a classic design and high-quality materials, they complement your stylish ensemble.",
      "price": 79.99,
      "image": "https://cdn.dummyjson.com/products/images/womens-shoes/Calvin%20Klein%20Heel%20Shoes/1.png",
      "category": "clothing",
      "status": "pending",
      "featured": true
    },
    {
      "seller": "67d6ad2e23879bc80d3852f4",
      "name": "Golden Shoes Woman",
      "description": "The Golden Shoes for Women are a glamorous choice for special occasions. Featuring a golden hue and stylish design, they add a touch of luxury to your outfit.",
      "price": 49.99,
      "image": "https://cdn.dummyjson.com/products/images/womens-shoes/Golden%20Shoes%20Woman/1.png",
      "category": "clothing",
      "status": "approved",
      "featured": true
    },
    {
      "seller": "67d6ad2e23879bc80d3852f4",
      "name": "Pampi Shoes",
      "description": "Pampi Shoes offer a blend of comfort and style for everyday use. With a versatile design, they are suitable for various casual occasions, providing a trendy and relaxed look.",
      "price": 29.99,
      "image": "https://cdn.dummyjson.com/products/images/womens-shoes/Pampi%20Shoes/1.png",
      "category": "clothing",
      "status": "pending",
      "featured": false
    },
    {
      "seller": "67d6ad2e23879bc80d3852f4",
      "name": "Red Shoes",
      "description": "The Red Shoes make a bold fashion statement. Designed for comfort and style, they are perfect for both casual and semi-formal occasions.",
      "price": 39.99,
      "image": "https://cdn.dummyjson.com/products/images/womens-shoes/Red%20Shoes/1.png",
      "category": "clothing",
      "status": "approved",
      "featured": false
    }
  ]
  
  
  
  

  const seedDatabase = async () => {
    try {
      await connectDB();
  
      await Product.insertMany(products);
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  
  // Call the function
  seedDatabase();
  