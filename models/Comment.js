const mongoose = require('mongoose');

const AVATAR_PATH = "/uploads/Blogs/comments";

const multer = require('multer');

const path = require('path');

const CommentController = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog"
    },
    
    email : {
        type : String,
        required : true
    },
   
   comment : {
    type : String,
    required : true
   },
    
    image : {
        type : String,
        required : true
    },
    isActive :{
        type : Boolean,
        required : true
    }
});

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH))
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now())
    }
})

CommentController.statics.uploadedAvatar = multer({storage:storage}).single('image');
CommentController.statics.avatarPath = AVATAR_PATH;

const Comment = mongoose.model('Comment', CommentController);

module.exports = Comment;