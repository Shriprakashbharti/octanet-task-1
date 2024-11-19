const express = require('express')
const app = express()
const dotenv=require("dotenv");
dotenv.config({ path: "./.env" });
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");
const { mongoose } = require('mongoose');
const Doner=require("./model/doner.js");
const sendEmail=require("./sendEmail.js");
const fileUpload = require("express-fileupload");
const port=process.env.PORT
const mongoUrl=process.env.MONGO_URI



app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));


main().then(()=>{
    console.log("Connected to database.");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongoUrl);
}


const cloudinary = require('cloudinary').v2;


const multer  = require('multer');
const {storage}=require("./cloudinaryConfig.js");
const upload = multer({storage });

cloudinary.config({
    cloud_name:process.env.CLOUDANRY_NAME,
    api_key:process.env.CLOUDANRY_API_KEY,
    api_secret:process.env.CLOUDANRY_API_SECRET,
});


app.get("/",(req,res)=>{
    res.render("index.ejs");
    
});

const passAdmin=process.env.LOGPASS_ADMIN;

app.get("/admin/doners", async(req,res)=>{
   let doners=await Doner.find(); 
   
   res.render("admin.ejs",{doners});
});

app.get("/admin/doners/:id/view" , async(req,res)=>{
    let {id}=req.params;
    let doners= await Doner.findById(id);
    res.render("view.ejs" ,{doners});
    
});



app.post("/donate-food",  async(req,res)=>{
    try {
        if (!req.files || !req.files.foodImage) {
            return res.status(400).send("No file uploaded.");
        }
        const foodImage = req.files.foodImage;
        const uploadResponse = await cloudinary.uploader.upload(
            foodImage.tempFilePath,
            { folder: "Food Photo" }
        );
        const url= uploadResponse.secure_url;
        console.log("Image URL:", uploadResponse.secure_url);
        let {
            firstName,
            lastName,
            phone,
            job_role,
            address,
            city,
            pinCode,
            Date,
        }=req.body;
      
        let donerList=new Doner({
            firstName:firstName,
            lastName:lastName,
            phone:phone,
            role:job_role,
            address:address,
            city:city,
            pinCode:pinCode,
            Date:Date,
            
            
        });
        donerList.foodImage={url};
       
        donerList.save().then((res)=>{
            console.log(donerList);
        });
        
        res.redirect("/");
        const userMail=process.env.ADMIN_EMAIL;
        const message=`
            Subject:Congratulations on Becoming a Valued Food Doner!
            Name: ${firstName} ${lastName}
            Phone: ${phone}
            Address: ${address}
            Pincode: ${pinCode} 
        `;
        try {
          await sendEmail({ 
                to:userMail,
                subject: `New Donor Submission`,
                message,
               
            });
            console.log(" email send successfully");
        } catch (err) {
             console.log(err);
        }
    } catch (err) {
        console.log(err)
    }
});



app.get("/admin",(req,res)=>{
    res.render("login.ejs");
});

app.post("/admin/pass",(req,res)=>{
    let {email}=req.body.admin;
    if(email===passAdmin){
        res.redirect("/admin/doners");
    }
})

app.listen(port, () => console.log(` app listening on port ${port}!`))