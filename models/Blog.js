const mongoose = require('mongoose');

const AVATAR_PATH = "/uploads/Blogs";

const multer = require('multer');

const path = require('path');

const BlogSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    avatar : {
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

BlogSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
BlogSchema.statics.avatarPath = AVATAR_PATH;

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;