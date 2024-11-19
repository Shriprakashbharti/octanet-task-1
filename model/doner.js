const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const donerschema=new Schema({
    firstName:{
        type: String,
        require:true,
    },
    lastName:{
        type:String,
        require: true,
    },
    phone:{
        type:Number,
        require,
        length:10,
    },
    role:{
        type:String,
        
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    pinCode:{
        type:Number,
    },
    Date:{
        type:String,
    },
    foodImage:{
    url:{
        type:String,
    },
  
    },
});



module.exports=mongoose.model("Doner",donerschema);