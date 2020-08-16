require("dotenv").config();

const { Bot, shortHands } = require("yatbl");
const bot = new Bot(process.env.BOT_TOKEN);
const tapi = bot.tapi;

// @todo Dont repeat this...
// Set the list of commands first on startup
shortHands.setCommands(tapi, [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show the help menu" },
  { command: "settings", description: "Edit settings of bot" },
  { command: "unsub", description: "Unsubscribe from all notifications" },
]);

bot.addShortHand(shortHands.replyMessage);
bot.addShortHand(shortHands.getCommand);

// Simple mock DB
const DB = {
  chatIDs: [],
};

/**
 * Handler for start commands, where users register their
 */
bot.addHandler(async function (update) {
  const startCommands = this.getCommand("start");
  // Skip this handler if there is no start command
  if (!startCommands) return;

  // If the arguement for the first start command is null (empty) and no need to await too.
  if (!startCommands[0]) return this.replyMessage("Invalid register UUID");

  // register the user
  // @todo Handle re-registrations, should not have double registration
  console.log(startCommands[0][0]);
  DB.chatIDs.push(update.message.chat.id);
});

/**
 * Handler for unsub commands, where users request to unsubscribe for notifications
 */
bot.addHandler(async function (update) {
  const unsubCommands = this.getCommand("unsub");
  // Skip this handler if there is no unsub command
  if (!unsubCommands) return;

  // Remove the user
  const index = DB.chatIDs.indexOf(update.message.chat.id);
  if (index > -1) DB.chatIDs.splice(index, 1);

  return this.replyMessage("Successfully unsubscribed from all notifications!");
});

// Demo "notif" sending, once every 10 seconds send notif to all registered users
setInterval(function () {
  console.log("Sending new notif!");

  DB.chatIDs.forEach((chatID) =>
    tapi("sendMessage", {
      chat_id: chatID,
      text: "Notif!",
    })
  );
}, 10000);

bot.startPolling(0);
