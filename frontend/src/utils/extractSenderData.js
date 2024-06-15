const extractSenderData = (data, userIdToRemove) => {
  const result = [];

  data.forEach((chat) => {
    let chatInfo = {
      latestMessage: chat?.latestMessage,
      user: null,
      chat_id: chat._id,
    };
    chat?.participants.forEach((user) => {
      if (user._id !== userIdToRemove) {
        chatInfo.user = user;
        result.push(chatInfo);
      }
    });
  });

  return result;
};

export default extractSenderData;
