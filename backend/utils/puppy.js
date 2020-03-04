
const improvePuppy=async (page) => {
    await page.setRequestInterception(true);

    //New
    page.on('request', (req) => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
}

module.exports={
    improvePuppy
}