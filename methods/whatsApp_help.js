module.exports = `FETCH/GET/GO *none/any* ANNOUNCEMENT(s) *none/any* *COURSE CODE HERE*

You can specify the keyword "latest" after FETCH/GET/GO to only get the latest announcement.


SEARCH *none/any* ANNOUNCEMENT(s) *none/any* FOR "query/regex" *none/any* *COURSE CODE HERE*

Quotes are optional, but if you don't specify quotes, it'll only match the first word after it.


Debug test

Will print out "Bot up!" if the bot is functioning.


Print help

Will print out this list of commands.


Note, none of these commands are case sensitive. You may put it in all lowercase or all uppercase, the bot does not care.

Examples:

Go get the announcements for ipc

Fetch the latest announcement for ipc

Search the announcements for "example" in IPC

Search the announcements for example in ipc

Search the announcements for "/(?:example).?(lap.+ps)/i" in ipc`;