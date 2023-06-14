var Blog = require('../../models/Blog');
var Comment = require('../../models/Comment');

module.exports.add_blog = async (req,res)=>{
    return res.render('Add_blog');
}

module.exports.insertBlogrecord = async (req,res) =>{
    // console.log(req.file);
    // console.log(req.body);
    // console.log(req.user.name)
    var todayDate = new Date().toISOString().slice(0, 10);
    // console.log(todayDate);

    var imagePath = '';
    if(req.file){
        imagePath = Blog.avatarPath+"/"+req.file.filename;
    }
    req.body.avatar = imagePath;
    req.body.date = todayDate;
    req.body.username = req.user.name;
    req.body.isActive = true

    let blogData = await Blog.create(req.body);
    if(blogData){
        req.flash('success','BLog record inserted');
        return res.redirect('/blogs/add_blog');
    }
    else{
        req.flash('error', 'Something wrong');
        return res.redirect('/blogs/add_blog');
    }
}


module.exports.viewComments = async (req,res) =>{
    // let commentData = await Comment.find({});
    let commentData = await Comment.find({}).populate('blogId').exec();
    console.log(commentData);
    return res.render('view_comment', {
        'commentData' : commentData
    })
}