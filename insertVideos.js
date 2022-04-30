const {addVideo,video,createVideoTable,getAllVideos,getVideobyID, getVideobyHash, dropAllVideos,getPartOfVideobyID,getVideoSizeByID,getRelatedVideos}=require('./database')
 const fs=require('fs') 
 const { getVideoDurationInSeconds } = require('get-video-duration') 

 // converts seconds to hours:minuts:sec
function secondsToTime(allsec){
    allsec=parseInt(allsec)
const hour=parseInt(allsec/60/60)
const min=parseInt(allsec/60)-hour*60
const sec=allsec-min*60-hour*60*60
return `${hour}:${min}:${sec}`
}


async function putinDatabase(){

    await new Promise(e=>{
        fs.readdir('./videos',(err,files)=>{
            const fun=async ()=>{
            for(let i=0;i<files.length;i++){
                const fullpath=`./videos/${files[i]}`
                await new Promise(ee=>{
                    fs.readFile(fullpath,(err,data)=>{
                        const v=new video()
                        v.title=fullpath
                        v.content=data
                        v.description="Epstin didnt kill himself"
                        v.tags="#porn"
                        v.thumbnail="/thumbnail/0"
                        v.views=parseInt(Math.random()*1000000)
                        v.likes=parseInt(Math.random()*v.views)
                        v.dislikes=v.views-v.likes 
                        getVideoDurationInSeconds(fullpath).then((secs)=>{
                            v.length=secondsToTime(secs) 
                            addVideo(v)
                            console.log(`video added ${v.title}`)
                            ee()
                        })
                    })
                })
            }
            e()
        }
        fun()
        })
    })

}
 


async function main(){  

 
    createVideoTable()
    await putinDatabase()    
 
    

}

main()
