const sulla  = require('sulla');
const methods = require('./methods/whatsApp_methods');

sulla.create().then(client => start(client));

function start(client) {
  
  client.onMessage(async message => {

    if (/(FETCH|GET|GO).+?(ANNOUNCEMENTS)/i.test(message.body)){
      
      const course_id = /(IPC|ULI|APS|CPR)(?: ?(\w+([?.]+)?$)?)?|\?$/i.exec(message.body);
      
      if(course_id && course_id[1]){
      
        client.sendText(message.from, 'One moment...');
      
        const announcements = await methods.fetch_announcements(course_id[1]);
      
        if(announcements) return announcements.forEach(a=>client.sendText(message.from, a));
      
        return client.sendText(message.from, 'Hmm. Something went wrong!');
      }
    }

    if(message.body === 'Debug test') client.sendText(message.from, 'Bot up!');
  
  });
}