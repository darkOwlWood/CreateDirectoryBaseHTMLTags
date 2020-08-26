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


//MAIN
if(document.querySelector('.TimelineNav')){
    console.log('Yes nigga');

    document.querySelector('video').pause();
    document.querySelector('.TimelineNav-button').click();
    const HtmlTree = HTMLtoJSON(document.querySelector('.TimelineNav-folded'));

    fetch('http://localhost:8085/',{
        method: 'POST',
        body: JSON.stringify(HtmlTree),
        headers:{
            'Content-type': 'application/json', 
        },
        mode: 'no-cors',
    });
}else{
    console.log('No nigga');
}