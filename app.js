const express = require('express');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
require('dotenv').config()
const cors = require("cors");

const app =express();

//middle-wares 
app.use(express.json());
app.use(cors());

const DB =process.env.MONGO_DB;

//connecting database

mongoose.connect(DB,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connection successful');
}).catch((err)=>{
    console.log(err);
})

const formdataformat =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    top:{
        type:String,
        required:true
    },
    toc:{
        type:String,
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    projectdetails:{
        type:String,
        required:true
    }
})

const projectModel = mongoose.model('project',formdataformat);

app.post('/projectdetails',async(req,res,next)=>{
    const {name,company,website,email,phone,top,toc,budget,projectdetails} = req.body;
    
    const collect = await projectModel.create({
        name:name,
        company:company,
        website:website,
        email:email,
        phone:phone,
        top:top,
        toc:toc,
        budget:budget,
        projectdetails:projectdetails
    });
    console.log(collect);
    
    if(collect){
        res.status(200).json({
            success:true,
        })
    }
    else{
        res.status(400).json({
            success:false,
        })
    }
})

app.get('/',(req,res,next)=>{
    res.send("SERVER WORKING");
});

app.get('/sendalldata',async(req,res,next)=>{
   
    let wb = XLSX.utils.book_new()
    let store_data = await projectModel.find();
    console.log(store_data);
    if(store_data){
        let t = JSON.stringify(store_data)
        let final_data = JSON.parse(t)
        let ws  = XLSX.utils.json_to_sheet(final_data)
        let down = __dirname + '/exporteddata.xlsx'
        XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
        XLSX.writeFile(wb,down)
        res.download(down)
    }else{
        res.status(200).json({success:false });
    }
});

app.post('/sendalldata/admin',async(req,res,next)=>{
    if(req.body.password=="meetshah12@"){
        res.status(200).json({success:true, msg:'file downloaded successfully'})
    }else{
    res.status(200).json({success:false,msg:'Wrong password pls try again'})
}
});

app.listen(5000,()=>{
    console.log("server running at port 5000" );
})
