const Project=require("../models/Project");
const Category=require("../models/Category");
const Idea=require("../models/Idea");
const createProject=async(req,res)=>{try{const p=await Project.create({...req.body,owner:req.user.id,members:[req.user.id]});res.status(201).json({project:p});}catch(e){res.status(500).json({message:"Unable to create project",error:e.message});}};
const getProjects=async(req,res)=>{try{const projects=await Project.find({$or:[{owner:req.user.id},{members:req.user.id}]}).populate("idea","title").populate("members","name email").sort({createdAt:-1});res.json({projects});}catch(e){res.status(500).json({message:"Unable to load projects"});}};
const updateProject=async(req,res)=>{try{const p=await Project.findById(req.params.id);if(!p)return res.status(404).json({message:"Project not found"});if(p.owner.toString()!==req.user.id&&req.user.role!=="admin")return res.status(403).json({message:"Not authorized"});Object.assign(p,req.body);await p.save();res.json({project:p});}catch(e){res.status(500).json({message:"Unable to update project"});}};
const getCategories=async(req,res)=>{try{res.json({categories:await Category.find().sort({name:1})});}catch(e){res.status(500).json({message:"Unable to load categories"});}};
const createCategory=async(req,res)=>{try{const c=await Category.create({name:req.body.name,description:req.body.description||""});res.status(201).json({category:c});}catch(e){res.status(400).json({message:"Unable to create category",error:e.message});}};
module.exports={createProject,getProjects,updateProject,getCategories,createCategory};
