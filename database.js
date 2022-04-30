 const sqlite=require('sqlite3').verbose()
const DEFAULTLIMIT=10
const DEFAULTOFFSET=0

let con=new sqlite.Database('./platform.db',sqlite.OPEN_READWRITE,(err)=>{
    if(err){
        console.log(`cant connect to sqlite ${err}`)
    }
})

function randomString(){
    const s ="QWERTYUIOPLKJHGFDSAZXCVBNM1234567890qwertyuioplkjhgfdsazxcvbnm";
    let alfabet=[]
    for(let i=0;i<s.length;i++){
        alfabet.push(s.charAt(i))
    }
    let ret=''
    for(let i=0;i<10;i++){
        const char=parseInt(Math.random()*alfabet.length) 
        ret+=alfabet[char]
    }
    return ret
}

// this function converts sql result into video object
function readVideo(res){
let v=new video()
v.title=res.title
v.description=res.description

// reason is because of functions like getVideobyViews or getVideobyPopularity i dont need content itself of that videos just hashes,titles,thumbnail and generally basic info of video
try{
v.id=res.id
v.content=res.content
}catch(e){}

v.thumbnail=res.thumbnail
v.likes=res.likes
v.dislikes=res.dislikes
v.tags=res.tags
v.views=res.views
v.time=res.uploaded
v.hash=res.hash
v.length =res.length 
return v
}

function createVideoTable(){
  const sql=`
    create table videos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title varchar(2000) not null,
   description Text ,
   content LONGBLOB ,
   bytesize int, 
   thumbnail Text,
   likes int default 0,
   dislikes int default 0,
   tags tinyText,
   views int default 0,
   length time(0), 
   hash varchar(60) not null,
   uploaded datetime default CURRENT_TIMESTAMP
   );`
                con.run(sql)

}


class video{
    id
    title
    description
    content
    thumbnail
    likes
    dislikes
    tags
    views
    time
    hash
    length 
} 

async function addVideo(video){
    const sql=`insert into videos (title,description,content,thumbnail,tags,hash,bytesize,length) values ('${video.title}','${video.description}',?,?,'${video.tags}','${randomString()}',${video.content.length},'${video.length}');`
            con.all(sql,[video.content,video.thumbnail],(err,res)=>{
                if(err){
                    console.log(err)
                    console.log(sql)
                }
            }) 
}

// for testing purposes 
async function getAllVideos(){
    const sql=`select * from videos;`
    con.all(sql,(err,res)=>{
        console.log(res)
    })
}

async function getVideobyID(id){
    const sql=`select * from videos where id=${id};`
    let video;
   await new Promise(e=>{
    con.all(sql,(err,res)=>{
        if(!res[0]){e() ;return }
        video=readVideo(res[0])
        e()
    })
    })
    return video;
}

function dropAllVideos(){
    const sql='drop table videos;'
    con.run(sql)
}

async function getVideobyHash(hash){
    const sql=`select * from videos where hash='${hash}';`
    let video;
   await new Promise(e=>{
    con.all(sql,(err,res)=>{
        if(!res[0]){e() ;return }
        video=readVideo(res[0])
        e()
    })
    })
    return video;
}

/*          it doesnt work as it sould be with blobs          */
async function getPartOfVideobyID(id,from,to){
    if(from==undefined || from==0){
        from=1
    }
    const sql=`select SUBSTRING(content,${from},${to}) as content from videos where  id = ${id} ;`
    let buf;
    await new Promise(e=>{
            con.all(sql,(err,res)=>{
                if(!res[0]){e() ;return }
                buf=res[0].content 
                console.log(sql)        
                e()
           })
        }) 
        return buf;
}

async function getVideoSizeByID(id)  {
    const sql=`select bytesize from videos where  id = ${id} ;`
    let buf;
    await new Promise(e=>{
            con.all(sql,(err,res)=>{ 
                if(!res[0]){e() ;return }
                buf=res[0].bytesize          
                e()
           })
        }) 
        return buf;
}
async function getVideoSizeByHash(hash)  {
    const sql=`select bytesize from videos where  hash = '${hash}' ;`
    let buf;
    await new Promise(e=>{
            con.all(sql,(err,res)=>{ 
                if(!res[0]){e() ;return }
                buf=res[0].bytesize          
                console.log(res[0])
                e()
           })
        }) 
        return buf;
}


async function getVideoInfoByID(id){ 
    const sql=`select title,description,thumbnail,likes,dislikes,tags,views,length,id,uploaded from videos where id=${id} ;`
    let videos
    let def=await new Promise((e,fail)=>{
        con.all(sql,(err,res)=>{
            if(!res[0]){e() ;return}
            videos=res[0]
            e()
        })
    })
    return videos;
}

async function getVideosbyViews(limit,offset){
    offset==undefined? offset=0:{}
    limit==undefined? limit=DEFAULTLIMIT:{}
    const sql=`select title,description,thumbnail,likes,dislikes,tags,views,length,id,uploaded from videos order by views desc limit ${limit} offset ${offset} ;`
    let videos=[]
    let def=await new Promise((e,fail)=>{
        con.all(sql,(err,res)=>{
            if(!res[0]){e() ;return}
            for(let i=0;i<res.length;i++){
                videos.push(readVideo(res[i]))
            }
            e()
        })
    })
    console.log(videos.length)
    return videos;
}

async function getVideosbyPopularity(limit,offset){
    offset==undefined? offset=0:{}
    limit==undefined? limit=DEFAULTLIMIT:{}
    const sql=`select title,description,thumbnail,likes,dislikes,tags,views,length,uploaded,id,likes/dislikes as popularity from videos order by popularity desc limit ${limit} offset ${offset} ;`
    let videos=[]
    await new Promise(e=>{
        con.all(sql,(err,res)=>{
            if(!res[0]){e() ;return}
            for(let i=0;i<res.length;i++){
                videos.push(readVideo(res[i]))
            }
            e()
        })
    })
    return videos;
}

async function getVideosbyUploadDate(limit,offset){
    offset==undefined? offset=0:{}
    limit==undefined? limit=DEFAULTLIMIT:{}
    const sql=`select title,description,thumbnail,likes,dislikes,tags,views,length,uploaded,id from videos order by uploaded desc limit ${limit} offset ${offset} ;`
    let videos=[]
    await new Promise(e=>{
        con.all(sql,(err,res)=>{
            if(!res[0]){e() ;return}
            for(let i=0;i<res.length;i++){
                videos.push(readVideo(res[i]))
            } 
            e()
        })
    })
    return videos;
}

async function getRelatedVideos(id,limit,offset){ 
    limit==undefined? limit=DEFAULTLIMIT:{}
    offset==undefined? offset=DEFAULTOFFSET:{}
    if(!id){return}
    const main=await getVideoInfoByID(id)

    let sql=`select title,description,thumbnail,likes,dislikes,tags,views,length,uploaded,id from videos where title LIKE '%${main.title}%'   union `
    sql+=`select title,description,thumbnail,likes,dislikes,tags,views,length,uploaded,id from videos where description LIKE '%${main.description}%' union `
    sql+=`select title,description,thumbnail,likes,dislikes,tags,views,length,uploaded,id from videos where tags LIKE '%${main.tag}%' limit ${limit} offset ${offset};`
    let videos=[]
    await new Promise(e=>{
        con.all(sql,(err,res)=>{
            if(err){console.log(sql+'\n'+err);}
            if(!res[0]){e() ;return}
            for(let i=0;i<res.length;i++){ 
                videos.push(readVideo(res[i]))
            } 
            e()
        })
    })
    //console.log('related videos :: '+JSON.stringify(videos))
    return videos;
}


module.exports={
createVideoTable,
addVideo,
video,
getAllVideos,
getVideobyID,
getVideobyHash,
dropAllVideos,
getPartOfVideobyID,
getVideoSizeByID,
getVideosbyViews,
getVideosbyPopularity,
getVideosbyUploadDate,
getVideoSizeByHash,
getRelatedVideos,
getVideoInfoByID
}