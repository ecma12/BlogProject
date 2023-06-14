const Admin = require('../../models/Admin');
const Slider = require('../../models/Slider');
const Blogs  = require('../../models/Blog');
const Comment = require('../../models/Comment');

module.exports.userHome = async ( req,res) =>{
    let SliderData = await Slider.find({});
    let BlogsData = await Blogs.find({});
    return res.render('userPanel/user_home', {layout: 'userPanel/user_home','sliderRecords' : SliderData, 'BlogsData': BlogsData});
}

module.exports.BlogSingle = async (req,res) =>{
    let singleRecord = await Blogs.findById(req.params.id);

    let countComment = await Comment.find({blogId:req.params.id,isActive: true}).countDocuments();
    let commentData = await Comment.find({blogId:req.params.id,isActive: true});

    let lastRecord = await Blogs.find({}).sort({_id : -1}).limit(3);
    


    let AllBlogs = await Blogs.find({isActive: true});

    var blogId = [];
    for(var i=0; i<AllBlogs.length; i++){
        blogId.push(AllBlogs[i].id)
    }

    var next;
    for(var i=0; i<blogId.length; i++){
        if(req.params.id == blogId[i]){
            next = i;
        }
    }
    
    var prev;
    for(var i=0; i<blogId.length; i++){
        if(req.params.id == blogId[i]){
            prev = i;
        }
    }

    console.log(blogId[next+1])
    


    return res.render('userPanel/Blog_single', {layout : 'userPanel/Blog_single', 'singleR' : singleRecord, 'blogId': req.params.id, 'commentData':commentData, countComment : countComment, lastRecord : lastRecord, allBlogsData : blogId,next: next, prev : prev });
}


module.exports.setComments = async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    var imagePath = '';
    if(req.file){
        imagePath = Comment.avatarPath+"/"+req.file.filename;
    }

    req.body.image = imagePath;
    req.body.isActive = true;
    let commentData = await Comment.create(req.body);
    if(commentData){
        return res.redirect('back');
    }
    else{
        console.log("error");
        return res.redirect('back');
    }

}