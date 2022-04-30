class video{
    export=document.createElement('div') 
    #title=document.createElement('div')
    #thumbnail=document.createElement('img')
    #likes=document.createElement('div')
    #dislikes=document.createElement('div')
    #views=document.createElement('div') 
    #length=document.createElement('div')
    #data=document.createElement('div')
    constructor(){
        this.export.style.width="300px"
        this.export.style.height="200px" 
        this.export.style.position="relative"
        this.export.style.float="left"
        this.export.style.margin="10px"
        this.export.style.border="solid black 1px"
        this.export.appendChild(this.#thumbnail)
        this.#thumbnail.style.position='absolute'
        this.#thumbnail.style.width='100%'
        this.#thumbnail.style.height='90%'
        this.#thumbnail.style.left='0px'
        this.#thumbnail.style.top='0px'
        this.#title.style.position='absolute'
        this.#title.style.bottom='0px'
        this.#title.style.width="100%"
        this.#title.style.textAlign="center"
        this.#title.className="text"
        this.#title.style.fontSize="15px"
        this.#title.style.background="white"
        this.#likes.style.position="absolute"
        this.#dislikes.style.position="absolute"
        this.#views.style.position="absolute"
        this.#dislikes.style.bottom="10%"
        this.#likes.style.bottom="20%"
        this.#views.style.bottom="30%"
        this.#dislikes.style.color="white"
        this.#likes.style.color="white"
        this.#views.style.color="white"
        this.#length.style.position="absolute"
        this.#length.style.right="0px"
        this.#length.style.bottom="10%"
        this.#length.style.background="black"
        this.#length.style.color="white"
        this.#data.style.position="absolute"
        this.#data.style.right="0px"
        this.#data.style.bottom="-15px"
        this.#data.style.fontSize="10px"
        this.#data.style.color="black"
        

        this.export.appendChild(this.#likes)
        this.export.appendChild(this.#dislikes)
        this.export.appendChild(this.#views)
        this.export.appendChild(this.#length)
        this.export.appendChild(this.#title)
        this.export.appendChild(this.#data)

    }

    setTitleandLink(title,videolink){
        this.#title.innerHTML=`<a href="${videolink}">`+title+'</a>'
    }
    setThumbnail(thumbnail){
        this.#thumbnail.src=thumbnail
    }
    setLikes(num){
        this.#likes.innerHTML=`👍`+num
    }
    setDislikes(num){
        this.#dislikes.innerHTML=`👎`+num
    }
    setViews(num){
        this.#views.innerHTML='👁️'+num
    }
    setLength(time){
        this.#length.innerHTML=time
    }
    setData(data){
        this.#data.innerHTML=data
    }

}