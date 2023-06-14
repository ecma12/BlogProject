const Slider = require('../../models/Slider');

module.exports.sliderPage = async (req,res) =>{
    return res.render('Add_slider');
}


module.exports.insertSliderRecord = async (req,res) =>{
    console.log(req.body);
    console.log(req.file);
    var image_path = '';
    if(req.file){
        image_path = Slider.avatarPath+"/"+req.file.filename; 
    }
    req.body.slider_image = image_path;
    let SliderRecord = await  Slider.create(req.body);
    if(SliderRecord){
        return res.redirect('/slider/add_slider');
    }
    else{
        console.log("something wrong");
        return res.redirect('/slider/add_slider');
    }
}