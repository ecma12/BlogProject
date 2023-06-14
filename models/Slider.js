const mongoose = require('mongoose');

const AVATAR_PATH = "/uploads/Sliders";

const multer = require('multer');

const path = require('path');

const SliderSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true
    },
    slider_image : {
        type : String,
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

SliderSchema.statics.uploadedAvatar = multer({storage:storage}).single('slider_image');
SliderSchema.statics.avatarPath = AVATAR_PATH;

const Slider = mongoose.model('Slider', SliderSchema);

module.exports = Slider;