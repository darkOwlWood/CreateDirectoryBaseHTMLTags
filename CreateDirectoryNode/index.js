const http = require('http');
const path = require('path');
const fs   = require('fs');


const createDirectory = async (dirPath) => {
    const exist = await new Promise( resolve => fs.exists(dirPath, exist =>  resolve(exist) ));
    if(exist){
        await new Promise( resolve => fs.rmdir(dirPath, {recursive: true}, () => resolve('Done') ));
    }

    return await new Promise( (resolve, reject) => 
        fs.mkdir(dirPath, { recursive: true}, (err, path) => {
            if(err){   
                console.error(err);
                reject(err);
                return;
            }
            resolve(path);
        })
    );
}

const getElementsFromJson = (jsonString) => {
    const courseVideos = JSON.parse(jsonString);
    let sections = courseVideos.children[1].children;
    let courseTree = {};

    sections.forEach( element => {
        courseTree[`${element.text}`] = 
        element.children[1].children.map( obj => obj.text);
    });

    return courseTree;
}

const createDirsAndFiles = async (dirsFilesName, validPath) => {
    let dirKeyId = generateIdKey();
    let fileKeyId = generateIdKey();
    let PromiseArr = [];

    try{
        Object.keys(dirsFilesName).sort().forEach( dirName => {
            const fullPath = path.resolve(validPath,`${dirKeyId}.${dirName.slice(3)}`);
            PromiseArr.push(createDirectory(fullPath));
            dirKeyId = generateIdKey(dirKeyId);
        });        
    
        const dirsPath = await Promise.all(PromiseArr);
    
        Object.keys(dirsFilesName).sort().forEach( (dirName,ndx) => {
            dirsFilesName[dirName].forEach( fileName => {
                const fullPath = path.resolve(dirsPath[ndx],`${fileKeyId}(${fileName}).txt`);
                fs.writeFile(fullPath, '', () => {});
                fileKeyId = generateIdKey(fileKeyId);
            });
        });
    }catch(err){
        console.error(err);
    }
}

const generateIdKey = (previousKey) =>{
    if(previousKey){
        let letter       = previousKey[0].charCodeAt(0);
        let firstNumber  = parseInt(previousKey[1]);
        let secondNumber = parseInt(previousKey[3]);

        secondNumber = secondNumber===9? 1 : ++secondNumber;
        firstNumber = firstNumber===9? 1 : secondNumber===1? ++firstNumber : firstNumber; 
        letter = firstNumber===1 && secondNumber===1?  ++letter : letter;

        return `${String.fromCharCode(letter)}${firstNumber}_${secondNumber}`;
    }else{
        return 'A1_1';
    }
}

const createFilesTree = async (jsonString) => {
    const dirPath = path.resolve(__dirname,'..','OutputData');
    const dirFilesName = getElementsFromJson(jsonString);
    let validPath = await createDirectory(dirPath);
    createDirsAndFiles(dirFilesName,validPath);
} 

const router = (request, responce) => {
    let body = [];

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        createFilesTree(Buffer.concat(body).toString());
    });

    responce.end();
}



const server = http.createServer();
const port = 8085;
server.on('request', router);
server.listen(port, () => console.log(`Server listen at http://localhost:${port}`) );



/**TEST--------------- */
// fs.mkdir(path.resolve(__dirname,'..','test'), (err) => {
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log('Done');
// })

// fs.rmdir(path.resolve(__dirname,'..','test'), {recursive: true}, () => {});

//https://npmjs.org/package/rimraf
//https://www.npmjs.com/package/fs-extra
/**TEST--------------- */
