const AboutusDTO = {
    "_id": "63a86dcd691329cf9393bae5",
    "title": String,
    "body": String,
  }
const HomePageAboutUs /** Component */ = (props /**{user: User} */) /**JSX */ => {
    // Props data
    const User /*: UserModel */= props.user || {};
    const token  /* String */= "Bearer " + User.token || "";
    
    // States
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState(null);
    const toggleRef /**Ref */ = useRef(null);
    const [aboutUs, setAboutUs] = useState/**<AboutUsDTO> */({
        _id: "",
        title: "",
        body: ""
    })

    const [ aboutUsImage , setAboutUsImage] = useState/**<>*/({
     
        "fieldname": "",
        "mimetype": "",
        "destination": "",
        "filename": "",
        "path": "",
        "aboutUsId": "",
        "imgUrl": ""
    });


    // Effects
    useEffect(() => {
        fetchAboutUs()
    }, [])
    async function fetchAboutUs() /** Void */{
        setLoading(true);
        const aboutUsUrl /** String */ = "/home/aboutus";
        const aboutUsReq /** Response */ = await fetch(url);
        setLoading(false);
        if(aboutUsReq.ok){
            aboutUsResponse = (await aboutUsReq.json()).aboutUs;
            if(aboutUsResponse !== null){
                setAboutUs(aboutUsResponse);
                fetchAboutUsImage(aboutUsResponse._id);
            }
        }
    }

    async function fetchAboutUsImage(aboutUsId /** String */) {    
        const imgUrl /** String */  = '/home/aboutusimage/' + aboutUsId;
        const AboutUsImageReq /** Response */ = await fetch(imgUrl);

        if(AboutUsImageReq.ok){
            const aboutUsImage = (await AboutUsImageReq.json()).aboutUsImage;
            if(aboutUsImage !== null){
                setAboutUsImage(aboutUsImage);
            }
        }
    }
    
    // Events
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }

    function updateImage(e /**Event */) /**Void */{
        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
    }


    async function uploadImage(e /**Event */) /**void*/{
        e.preventDefault();
        if(!img){
            alert("Please, add a valid image");
            return ;
        }
        // Get aboutusId
        const aboutUsId /**ObjectId*/ = aboutUs._id;
        if(!aboutUsId){
            alert("Please, save an about us first, before uploading an image");
            return ;
        }
        // create form
        const formData /**FormData */ = new FormData();
        formData.append("img", img);
        formData.append("aboutUsId", aboutUsId);
        // Update Intro form
        const url /**String */ =  "/home/aboutusimage";
        setLoading(true);
        const imageReq /**Request */ = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });
        if(imageReq.ok){
            setLoading(false);
            const imageRes /**Response */ = await imageReq.json();
            // setHowToEarnImage(imageRes.howToEarnImage)
            setAboutUsImage(imageRes.aboutUsImage);
        }
    }



    // States
    const [howToEarn /* howToEarnDTO**/, setHowToEarn /** Funct<T, T> */] = useState({
        desc: "",
        steps: [
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
        ]
    })



    // Events
    function updateAboutUsAction(e /**Event */) /** void */{
        setAboutUs(prevData => ({...prevData, [e.target.name]: e.target.value}));
    }


    
    async function submitAboutUsAction(e /**Event */) /** void */{
        e.preventDefault();
        const {title, body} = aboutUs;
        if(!title.trim() || !body.trim()){
            alert("Please, include a title and a body")
            return ;
        }
        const aboutUsJSON /**JSON<HowToEarnDTO> */= JSON.stringify({title, body})
        const url /** String */= "/home/aboutus";
        setLoading(true);
        const request /**Response */ = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: aboutUsJSON
        })
        setLoading(false);
        if(request.ok){
            const response /**HowToEarnDTO */= await request.json();
            alert("About Us updated Successfully");
        }
    }
    return (<>
        {
            loading ? <Loading /> :
            <div className="container">
                <h3 className="containerDesc">
                    Update About Us
                    <button onClick={toggleRefDisplay}>Display</button>
                </h3>

                <main className="toggleRef hide" ref={toggleRef}>
                <form className="howToEarnDiv" onSubmit={submitAboutUsAction}>
                        <section>
                            <h3>Update  About Us</h3>
                            
                                    <div>
                                        <h4></h4>
                                        <h4>
                                            Update About Us Title
                                        </h4>
                                        
                                        <label>
                                            <input 
                                            value={aboutUs.title}
                                            name="title"
                                            onChange={updateAboutUsAction}
                                            />
                                        </label>

                                        <h4>Update About Us Body</h4>
                                        
                                        <label>
                                            <textarea 
                                            value={aboutUs.body}
                                            name="body"
                                            onChange={updateAboutUsAction}
                                            />
                                        </label>
                                    </div>
                              
                        </section>
                        <button>Update About Us</button>
                    </form>

                    <div className="howToEarnImageDiv">
                        <h3>Update About Us  image</h3>
                        
                        <section>
                            {
                                aboutUsImage?.imgUrl ?
                                <img crossOrigin="anonymous" src={aboutUsImage.imgUrl} style={{maxWidth: '100%'}} alt="About Us image" /> : <h3>
                                    No image for about us uploaded yet
                                </h3>
                            }
                        </section>

                        <form onSubmit={uploadImage}>
                            <h3>Upload About Us Image</h3>
                            <p>Please, make sure you have about us title and body, before uploading an image</p>
                            <label htmlFor="img">
                            <h3>About Us Image</h3>
                            <input 
                            type="file" 
                            required={true}
                            accept="image/*"
                            name="img"
                            onChange={updateImage}
                            />
                            <button>Upload Image</button>
                        </label>
                        </form>

                    </div>
                    

                    
                </main>

                
            </div>
        }
    </>
    )
}