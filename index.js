const sulla  = require('sulla');
const methods = require('./methods/whatsApp_methods');

const commands =  require('./methods/whatsApp_help');

sulla.create().then(client => start(client));

function start(client) {
  
  client.onMessage(async message => {

    if (/(FETCH|GET|GO).+?(ANNOUNCEMENTS?)/i.test(message.body)){
      
      const course_id = /(IPC|ULI|APS|CPR|ULI101|CPR101|IPC144|APS145)$/i.exec(message.body);
      
      const latest = /(FETCH|GET|GO).+?(LATEST).+?(ANNOUNCEMENTS?)/i.test(message.body);
      
      if(course_id && course_id[1]){
        
        client.sendText(message.from, 'One moment...');

        const announcements = await methods.fetch_announcements(course_id[1]);
        
        if(announcements && latest){

          return client.sendText(message.from, announcements[0]);
        
        } else if (announcements){
        
          return announcements.forEach(a=>client.sendText(message.from, a));
        
        }
        return methods.throw_error(client, message.from);
      }

    }

    if(/(SEARCH).+?(ANNOUNCEMENTS?)/i.test(message.body)){

      let search_term = /(?:FOR).+["'](.+)["']|(?:FOR)\s?(\w+)/i.exec(message.body);

      const course_id = /(IPC|ULI|APS|CPR|ULI101|CPR101|IPC144|APS145)$/i.exec(message.body);

      if(search_term && (search_term[1] || search_term[2]) && course_id && course_id[1]){

        if(search_term[1]) search_term = search_term[1].trim();
        else search_term = search_term[2].trim();

        client.sendText(message.from, 'One moment...');

        const announcements = await methods.fetch_announcements(course_id[1]);

        if(!announcements) return methods.throw_error(client, message.from); 
        
        const regex_flags = /\/(\w+)$/.test(search_term) ? 
                            /\/(\w+)$/.exec(search_term)[1] : 
                            '';
        
        const _regex = /\/(.+)\//.test(search_term) ? 
                       /\/(.+)\//.exec(search_term)[1] :
                       search_term;

        const arr_of_bools = announcements.map(e=>new RegExp(_regex, regex_flags).test(e));

        const num_of_items = arr_of_bools.filter(e=>e==1).length;
        
        const indexes = arr_of_bools.reduce((a,e,i) => {e && a.push(i); return a;}, []);

        if(num_of_items){
        
          client.sendText(message.from, `Hello! There's currently ${num_of_items} announcement${num_of_items>1?'s':''} that matches your search query!`);
        
          return indexes.forEach(i=>client.sendText(message.from, announcements[i]));
        
        }

        return client.sendText(message.from, `Sorry! There's no announcements that match your query!`);

      }else{
        return client.sendText(message.from, `Hey! Sorry about that, my Regex couldn't match what you wanted to search for! Make sure to include the course code and the term you wanna search for, make sure to wrap it in quotes if it contains spaces! `)
      }
    }
    
    if(message.body === 'Debug test') client.sendText(message.from, 'Bot up!');
    if(message.body === 'Print help') client.sendText(message.from, `Hello! I'm the chat bot. Here are my commands: 
${commands}`)
  });
}
