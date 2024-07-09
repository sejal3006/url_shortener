import express from 'express';
import { nanoid } from 'nanoid';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const isUrlValid = (url) =>{
    try{
        new URL(url);
        return true;
    } catch(e){
        return false;
    }
    

}

app.use(express.json())

app.get('/', (req, res)=>{
res.sendFile(__dirname + "/urlForm.html")
})

app.post('/url-shortner', (req, res) => {
        // if(!req.body.url || typeof req.body.url !== 'string' || !isUrlValid(req.body.url)){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid URL',
        //     })
        // }
    // console.log(req.body);
    
    const shotrUrl = nanoid(8);
    // console.log(shotrUrl);



    const urlMap = {
        [shotrUrl]: req.body.url,
    }

    // console.log(urlMap);

    const urlFileData = fs.readFileSync("urlmap.json", { encoding: "utf8" });
    const urlFileDataJson = JSON.parse(urlFileData);
    urlFileDataJson[shotrUrl] = req.body.url;

    fs.writeFileSync("urlMap.json", JSON.stringify(urlFileDataJson));
    res.json({
        success: true,
        data: `http://localhost:${port}/${shotrUrl}`,
    })
})

app.get('/:shortUrl', (req, res)=>{
    const fileData = fs.readFileSync("urlmap.json", { encoding: 'utf8'});
    const fileDataJson = JSON.parse(fileData);
    const shortUrl = req.params.shortUrl;
    const longUrl = fileDataJson[shortUrl]; //original long url
    if(!longUrl){
        return res
        .status(404)
        .json({success: false, message:'Short URL not found'})
    }
    res.redirect(longUrl)
    res.json({
        message:"short url recived"
    })
})
app.listen(port, ()=>{
    console.log(`Listening on port ${port} for urlShortner request`);
});