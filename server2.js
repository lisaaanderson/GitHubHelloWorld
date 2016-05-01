// JavaScript source code
console.log('Node is installed server2.js!');

var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();

var helloBot = new builder.BotConnectorBot();

helloBot.add('/', new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function (session) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            session.send('Hello %s! Nice to see you!', session.userData.name);
        }
    }));
helloBot.add('/profile', [
    function (session) {
        if (session.userData.name) {
            builder.Prompts.text(session, 'What would you like to change it to?');
        } else {
            builder.Prompts.text(session, 'Hi! What is your name?');
        }
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

server.use(helloBot.verifyBotFramework({ appId: 'YourAppID', appSecret: 'YourAppSecret' }));
server.post('/api/messages', helloBot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
