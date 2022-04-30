const express = require('express')
const {handleVideo}=require('./handleVideoExpress')
const {getVideoSizeByID,getVideobyID}=require('./database')
const fs=require('fs')
const app = express()
const port = 8080
app.get('/', (req, res) => { 
    console.log("index called")
  fs.readFile(`./frontend/views.html`,(err,data)=>{ 
    const header={
      "Content-Length": data.length,
      "Content-Type": "text",
    }
    console.log(header)
    res.writeHead(200,header)
    res.write(data)
    res.end()
  })
})
app.get('/main.css',(req,res)=>{
  fs.readFile(`./frontend/main.css`,(err,data)=>{ 
    const header={
      "Content-Length": data.length,
      "Content-Type": "text",
    }
    console.log(header)
    res.writeHead(200,header)
    res.write(data)
    res.end()
  })
})
app.get('/video.js',(req,res)=>{
  fs.readFile(`./frontend/video.js`,(err,data)=>{ 
    const header={
      "Content-Length": data.length,
      "Content-Type": "text",
    }
    console.log(header)
    res.writeHead(200,header)
    res.write(data)
    res.end()
  })
})
app.get('/thumbnail/0',(req,res)=>{
fs.readFile('./frontend/default.jpg',(err,data)=>{
    const headers = {
      "Content-Type": "image/jpg",
    }
    res.writeHead(200,headers)
    res.write(data)
    res.end()
  })
})

app.get('/video/:id',(req,res)=>{
  const id=parseInt(req.params.id)
  if(!id){
    return 
    res.end()
  }
  fs.readFile('./frontend/playVideo.html',(err,data)=>{
    const headers = {
      "Content-Length": data.length,
      "Content-Type": "text",
    }
    res.writeHead(200,headers)
    res.write(data)
  })
})
app.get('/favicon.ico',(req,res)=>{
  fs.readFile('./frontend/favicon.ico',(err,data)=>{
    const headers = {
      "Content-Length": data.length,
      "Content-Type": "image/ico",
    }
    res.writeHead(200,headers)
    res.write(data)
  })
})

app.get('/logo.svg',(req,res)=>{
fs.readFile('./frontend/logo.svg',(err,data)=>{
    const headers = {
      "Content-Length": data.length,
      "Content-Type": "image/svg+xml",
    }
    res.writeHead(200,headers)
    res.write(data)
  })
})

  app.get('/Database/video/:id',(req,res)=>{
    const id=parseInt(req.params.id)
    console.log(id)
    handleVideo(req,res,async (from,to)=>{return (await getVideobyID(id)).content.slice(from,to)},async()=>{return await getVideoSizeByID(id)})
  })
 

app.listen(port, () => {
  console.log(`server starts at port ${port}`)
})

