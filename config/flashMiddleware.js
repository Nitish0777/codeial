// middleware has 3 arguments
//request,response,next();
 
module.exports.setFlash = async(req,res,next)=>{
    try{
        res.locals.flash = {
            'success':req.flash('success'),
            'error':req.flash('error'),
        }
        next();

    }catch(err){
        console.log(err);
    }
}