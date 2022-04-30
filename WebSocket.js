const {getVideosbyPopularity,getVideosbyViews,getVideosbyUploadDate, getRelatedVideos,getVideoInfoByID}=require('./database')
const timeout=20*60*1000
const port=8081
async function handleMassage(massage,socket){

    /*
    massages will look like this
    {
        "mode":1
        "limit":10
        "offset":10
    }

    mods:
    0:get information about video(all parametars about video except its video itself)
    1: get videos by views 
    2: get videos by date(from newest to oldest)
    3: get videos by rating(form best like/dislike ratio to worst)
    4: get releted videos (get releted videos to video client is watching right now) 
     */ 
    const mode=massage.mode
    const limit=massage.limit
    const offset=massage.offset
    switch(mode){
        case 0 :socket.send(JSON.stringify(await getVideoInfoByID(massage.id)));break;
        case 1: socket.send(JSON.stringify(await getVideosbyViews(limit,offset))); break;
        case 2: const videos=await getVideosbyUploadDate(limit,offset);console.log("uzet iz baze"); socket.send(JSON.stringify(videos)); break;
        case 3: const videos1=await getVideosbyPopularity(limit,offset);console.log("uzet iz baze");socket.send(JSON.stringify(videos1)); break;
        case 4: socket.send(JSON.stringify(await getRelatedVideos(massage.id,limit,offset)));break;
    }
}


const ws=require('ws')
const server=new ws.Server({port:port})
console.log(`WebSocket Server started at port ${port}`)
server.on('connection',(socket)=>{
    socket.on('message',(data)=>{  
        try{
        const massage=JSON.parse(data.toString())
        console.log(massage)
        handleMassage(massage,socket)
        }catch(e){
            //wrong request by client
            console.log(`error bad request ${e}`)
            socket.close()
        }
    })
    setTimeout(()=>{
        socket.terminate()
    },timeout)
})