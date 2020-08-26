const HTMLtoJSON = (Element) => {
    let mainObj = { name: '', attributes: {}, children: [], text: '' };
    
    /**GET  TAG NAME */
    mainObj.name = Element.tagName;
    /**GET  TAG NAME */
    
    
    /**GET ATTRIBUTES */
    const attrNames = Element.getAttributeNames();
    attrNames.forEach(name => mainObj.attributes[`${name}`] = Element.getAttribute(name).split(/\s+/));
    /**GET ATTRIBUTES */
    
    
    /**GET TEXT */
    mainObj.text = Element.innerText.split(/\n/)[0];
    /**GET TEXT */
    
    
    /**GET CHILDREN */
    Array.prototype.forEach.call(Element.children, element => mainObj.children.push(HTMLtoJSON(element)));
    /**GET CHILDREN */
    
    return mainObj;
};

/**Made this function know if the nav is unfolded to start to get the structure */
const getTheTagsFromDOM = async (callback) => {
    try{
        if(document.querySelector('.TimelineNav')){        
            document.querySelector('video').pause();
            document.querySelector('.TimelineNav-button').click(); /**Solo click si esta fuera */
            const HtmlTree = HTMLtoJSON(document.querySelector('.TimelineNav-folded'));
        
            await fetch('http://localhost:8085/',{
                    method: 'POST',
                    body: JSON.stringify(HtmlTree),
                    headers:{
                        'Content-type': 'application/json', 
                    },
                    mode: 'no-cors',
                });
            
            callback({messageDidSend: 'OK'});
        }else{
            callback({messageDidSend: 'VOID'});
        }
    }catch(err){
        callback({messageDidSend: 'ERR'});
        console.error(err);
    }
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        getTheTagsFromDOM(sendResponse);
        return true;
    }
);