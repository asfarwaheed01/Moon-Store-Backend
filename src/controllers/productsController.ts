import { Request, Response } from "express";
import Product from "../db/model/product";
import cloudinary from "../utils/cloudinary";
import fs from "fs";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "Error Fetching Products" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    // Upload Image to Cloudinary
    const { path } = req.file;
    const result = await cloudinary.v2.uploader.upload(path);
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      image: result.secure_url,
      price: req.body.price,
      category: req.body.category,
      cloudinary_id: result.public_id,
    });
    await product.save();
    fs.unlinkSync(path);

    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(400).json({ message: "Error Adding Product" });
  }
};

export const editProducts = async (req: Request, res: Response) => {
  let product = await Product.findById(req.params.id).exec();
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  //   Delete the image from cloudinary
  await cloudinary.v2.uploader.destroy(product.cloudinary_id);

  let response;
  if (req.file) {
    const { path } = req.file;
    // response = await cloudinary.v2.uploader.upload(req.file.path);
    response = await cloudinary.v2.uploader.upload(path);
  }
  const data = {
    name: req.body.name || product.name,
    description: req.body.description || product.description,
    image: response?.secure_url || product.image,
    price: req.body.price || product.price,
    category: req.body.category || product.category,
    cloudinary_id: response?.public_id || product.cloudinary_id,
  };
  product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }
  res.status(200).json(product);
};

export const deleteProducts = async (req: Request, res: Response) => {
  let product = await Product.findByIdAndDelete(req.params.id).exec();
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product Deleted Successfully." });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).exec();
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json(product);
};

export const findProducts = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(name, "i");
    const products = await Product.find({ name: regex });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product Not Found" });
  }
};
