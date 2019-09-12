const puppet = require('puppeteer');

require('dotenv').config({path:require('find-config')('.env')})

const urls = {
    execute_url : '/webapps/blackboard/execute/announcement?method=search&course_id=',
    college_url : 'https://my.senecacollege.ca',
    login_url   : 'https://my.senecacollege.ca/auth-saml/saml/login?apId=_150_1'
}

const pages = {
  announcements : null,
  search        : null,
}

const courses = {
    ULI : '_595791_1',
    CPR : '_597069_1',
    IPC : '_597314_1',
    APS : '_602810_1',
}

const fetch_announcements = async course_id =>{
    try{    
        if(!pages.announcements){

            const browser = await puppet.launch();
        
            const page    = await browser.newPage();
            
            console.log('Creating page...');

            await page.goto(urls.login_url);
        
            await sign_into(page);
            
            pages.announcements = page;
        }
        
        let announcements = await fetch_course_announcements(pages.announcements, course_id);
        
        announcements = announcements.flat().map(e=>e.join(' ').replace(/\s+/g, ' ').trim());
        
        return announcements;
    }catch(e){
        console.log(e)
    }
}

const fetch_course_announcements = async (page, course_id) => {
    try{
        course_id = course_id.toUpperCase();
        
        if(!courses[course_id]) return 0;

        await page.goto(urls.college_url + urls.execute_url + courses[course_id]);
        
        const annoucements = await page.evaluate(() =>{
            
            const node_list_array = Array.from(document.querySelectorAll('.vtbegenerated'));
            
            const children_array  = node_list_array.map(e=>Array.from(e.children));
            
            let text = children_array.map(e=>e.map(e=>e.innerText))     
        
            return text;
        })

        return annoucements;
    }catch(e){
        console.log(e);
    }
}

const sign_into = async page =>{

    try{

        await page.type('#userNameInput', process.env.seneca_username);
        
        await page.type('#passwordInput', process.env.seneca_password);
        
        await page.click('#submitButton');
        
        await page.waitForNavigation(); 
        
        return 1;

    }catch(e){

        console.log(e);

    }
    
}

const throw_error = (client, user) => client.sendText(user, 'Hmm. Something went wrong!');

Array.prototype.flat = function(){
    return this.map(e=>[].concat.apply([],e))
}

module.exports = {
    fetch_announcements,
    throw_error
}

