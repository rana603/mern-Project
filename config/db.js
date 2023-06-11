const mongoose=require('mongoose');
const config=request=require('config');
const db=config.get("mongoURI");

const connectDB=async()=>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            useUnifiedTopology: true
          });
        console.log("mongodb Connected")

    }catch(err){
        console.error(err.message +"error")
        process.exit(1);
    }
};

module.exports=connectDB;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4M2RmZTEzYmZiYWRmOGNhMTk3ZjQyIn0sImlhdCI6MTY4NjM2NDEzMCwiZXhwIjoxNjg2NzI0MTMwfQ.ieT_sO4RfTOsgOtugzMEOejopcjMc70h79aR2rY4m0k