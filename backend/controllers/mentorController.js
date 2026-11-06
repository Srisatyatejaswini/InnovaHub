const Mentor = require("../models/Mentor");
const Idea = require("../models/Idea");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const User = require("../models/User");

const upsertMentor = async (req,res) => {
  try {
    const mentor = await Mentor.findOneAndUpdate({user:req.user.id}, {...req.body, user:req.user.id}, {new:true, upsert:true, setDefaultsOnInsert:true});
    res.json({mentor});
  } catch(e){ res.status(500).json({message:"Unable to save mentor profile", error:e.message}); }
};
const getMentors = async (req,res) => {
  try {
    const mentors = await Mentor.find().populate("user","name email role skills bio").sort({createdAt:-1});
    res.json({mentors});
  } catch(e){ res.status(500).json({message:"Unable to load mentors"}); }
};
const getMentorDashboard = async (req,res) => {
  try {
    const ideas = await Idea.find({status:{$in:["submitted","approved"]}}).populate("creator","name email role").sort({createdAt:-1});
    const reviews = await Review.find({mentor:req.user.id}).populate("idea","title").populate("student","name email").sort({createdAt:-1});
    res.json({ideas,reviews});
  } catch(e){ res.status(500).json({message:"Unable to load mentor dashboard"}); }
};
const reviewIdea = async (req,res) => {
  try {
    const {rating, feedback} = req.body;
    const idea = await Idea.findById(req.params.ideaId);
    if(!idea) return res.status(404).json({message:"Idea not found"});
    const review = await Review.findOneAndUpdate({idea:idea._id, mentor:req.user.id}, {idea:idea._id, mentor:req.user.id, student:idea.creator, rating, feedback, status:"published"}, {new:true, upsert:true});
    await Notification.create({user:idea.creator,title:"New Mentor Review",message:`Your idea "${idea.title}" received mentor feedback.`,type:"review"});
    res.status(201).json({review});
  } catch(e){ res.status(500).json({message:"Unable to save review",error:e.message}); }
};
const getIdeaReviews = async (req,res) => {
  try { const reviews=await Review.find({idea:req.params.ideaId}).populate("mentor","name email").sort({createdAt:-1}); res.json({reviews}); }
  catch(e){res.status(500).json({message:"Unable to load reviews"});}
};
module.exports={upsertMentor,getMentors,getMentorDashboard,reviewIdea,getIdeaReviews};
