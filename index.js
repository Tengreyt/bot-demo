const telegramApi = require('node-telegram-bot-api');
const token = '7446743875:AAGd6mMBPBzsJp5-wXQtqmeMWhQLTYBHHps';
const bot = new telegramApi(token, {polling: true});
const {gameOptions, againOptions} = require('./options.js');

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Отгадай число от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
const start =  () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра "Угадай число"'}
    ])

    bot.on('message',async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://data.chpic.su/stickers/h/howtosnippet/howtosnippet_005.webp?v=1701465016')
            return  bot.sendMessage(chatId, 'Привет!');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') { 
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
           return startGame(chatId);
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал! ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не отгадал! ${chats[chatId]}`, againOptions);
        }
    })
}

start()