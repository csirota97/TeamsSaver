/**
*
*  Recent changes may have broken this. If issues are found, please log them.
*
*/
const ITERATION_COUNT = 10;

const megalist = {
  channelName: "",
  conversations: []
};

const isThreadInList = (tId, list) => {
  return list.conversations.some(conversation => conversation.thread_id === tId)
}

class Conversation {
  constructor(message, user, date, thread_id) {
    this.message = message;
    this.user = user;
    this.date = date;
    this.replies = [];
    this.thread_id = thread_id;
  }

  reply(reply, user, date) {
    this.replies.push({reply, user, date})
  }
}

sortMegalist = (megalist) => {
  const conversations = megalist.conversations;
  megalist.conversations = conversations.sort((a, b) => {
    const aHour = Number.parseInt(a.date.substring(a.date.indexOf('/')+1, a.date.indexOf(' '))) + (a.date.includes('AM') ? 0 : 12);
    const bHour = Number.parseInt(b.date.substring(b.date.indexOf('/')+1, b.date.indexOf(' '))) + (b.date.includes('AM') ? 0 : 12);

    //Compare Months
    if (Number.parseInt(a.date.substring(0, a.date.indexOf('/'))) > Number.parseInt(b.date.substring(0,b.date.indexOf('/')))) {
      return 1;
    } 
    if (Number.parseInt(a.date.substring(0, a.date.indexOf('/'))) < Number.parseInt(b.date.substring(0,b.date.indexOf('/')))) {
      return -1;
    }

    //Compare Day of Month
    if (Number.parseInt(a.date.substring(a.date.indexOf('/') +1, a.date.indexOf(','))) > Number.parseInt(b.date.substring(b.date.indexOf('/') + 1, b.date.indexOf(',')))) {
      return 1;
    }
    if (Number.parseInt(a.date.substring(a.date.indexOf('/') +1, a.date.indexOf(','))) < Number.parseInt(b.date.substring(b.date.indexOf('/') + 1, b.date.indexOf(',')))) {
      return -1;
    }

    //Compare Hour of Day
    if (aHour > bHour) {
      return 1
    }
    if (aHour < bHour) {
      return -1
    }

    //Compate Minute of Hour
    if (Number.parseInt(a.date.substring(a.date.indexOf(':')+1, a.date.indexOf(' '))) > Number.parseInt(b.date.substring(b.date.indexOf(':') + 1, b.date.indexOf(' ')))) {
      return 1;
    }
    if (Number.parseInt(a.date.substring(a.date.indexOf(':')+1, a.date.indexOf(' '))) < Number.parseInt(b.date.substring(b.date.indexOf(':') + 1, b.date.indexOf(' ')))) {
      return -1;
    }
    return 0;
  });
  return megalist
}

iterator = []
for (let i = 0; i < ITERATION_COUNT; i++) {iterator.push(i)}

const runScript = async () => {
  megalist.channelName = document.querySelector('h2.channel-name').textContent;
  const execute = (i) => {
    const threads = [...document.querySelectorAll('thread')];
    threads.forEach(thread => {
      const message = thread.querySelector('thread-body').querySelector('div.message-body-content').textContent.trim();
      const user = thread.querySelector('thread-body').querySelector('div.ts-msg-name').textContent.trim();
      const date = thread.querySelector('thread-body').querySelector('span[data-tid="messageTimeStamp"]').textContent.trim();
      const tId = thread.parentNode.attributes.id.value;
      if (!isThreadInList(tId, megalist)) {
        const conversation = new Conversation(message, user, date, tId);
        repliesLink = thread.querySelector('a.ts-collapsed-common');
        if (repliesLink && !repliesLink.textContent.includes("Collapse all")) {
          repliesLink.click()
          while ([...thread.querySelectorAll('a.ts-collapsed-common')].some(link=>!link.textContent.includes("Collapse all"))) {
              [...thread.querySelectorAll('a.ts-collapsed-common')].filter(link=>!link.textContent.includes("Collapse all")).forEach(link=>link.click());
          }
        }
        const replies = [...thread.querySelectorAll('div.conversation-reply')];
        replies.forEach(reply => {
          replyDate = reply.querySelector('span.message-datetime').textContent.trim();
          replyUser = reply.querySelector('div.ts-msg-name').textContent.trim();
          replyMessage = reply.querySelector('div.message-body-content').textContent.trim();
          conversation.reply(replyMessage, replyUser, replyDate);
        })



        megalist.conversations.push(conversation);
      }
    })
    console.info(`${i+1}/${ITERATION_COUNT}`);
    console.log(megalist)
    if (i < ITERATION_COUNT - 1) {
      document.getElementsByTagName('virtual-repeat')[0].scrollBy(0,-1500);
    } else {
      console.info("|------------------------|\n" +
                  "|  All Channel Messages  |\n" +
                  "|   CAN BE FOUND BELOW   |\n" +
                  "|   AND ARE DOWNLOADED   |\n" +
                  "|------------------------|");
      console.log(sortMegalist(megalist));
      new JavascriptDataDownloader(sortMegalist(megalist), megalist.channelName).download();
    }
  }
  iterator.forEach((i) => {    
    setTimeout(() => execute(i), 5000*i)
  });
}


const startTime = Date.now()
class JavascriptDataDownloader {

    constructor(data={}, channelName="channel") {
        this.startTime = startTime;
        this.endTime = Date.now();
        this.timeDelta = `${(this.endTime - this.startTime) / 1000} seconds`
        this.data = data;
        this.channelName = channelName
    }

    download (type_of = "text/html", filename= `${this.channelName}.json`) {
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify({startTime:this.startTime, endTIme:this.endTime, timeDelta:this.timeDelta}),JSON.stringify(this.data, null, 2)], {
            type: type_of
        }));
        a.setAttribute("download", filename);
        body.appendChild(a);
        a.click();
        body.removeChild(a);
    }

    manualDownload (type_of = "text/html", filename= `${this.channelName}.json`) {
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
            type: type_of
        }));
        a.setAttribute("download", filename);
        body.appendChild(a);
        a.click();
        body.removeChild(a);
    }
} 

const manualDownload = () => new JavascriptDataDownloader(sortMegalist(megalist), megalist.channelName).manualDownload();
const getConvosListSize = () => megalist.conversations.length;

runScript();
