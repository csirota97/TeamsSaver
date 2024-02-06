/**
*
* This does not work. Use Firefox.
*
*/

const ITERATION_COUNT = 15;

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

const checkedThreads = []

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

    // F it, we ballin'
    return 0;
  });
  return megalist
}

function wait(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

let iterator = []
for (let i = 0; i < ITERATION_COUNT; i++) {iterator.push(i)}

const runScript = async () => {
  megalist.channelName = document.querySelector("h2[data-tid='channelTitle-text']")?.textContent || ""; //Updated
  const execute = async (i) => {
    console.warn(i)
    const threads = [...document.querySelectorAll('[data-tid="channel-pane-message"]')].filter(thread => {
      if (checkedThreads.includes(thread.id)) {
        return false;
      }
      checkedThreads.push(thread.id);
      return true;
    }); //updated
    threads.forEach(async (thread, index) => setTimeout(()=>{
        if (thread !== null) {
            if (thread.querySelector('[id="see-more-container"]') !== null){
                thread.querySelector('[id="see-more-container"]').firstChild.click();
            }
            const message = thread.querySelector('[data-testid="message-body-flex-wrapper"]')?.firstChild?.firstChild?.textContent?.trim() || "";
            const user = thread.querySelector('[data-tid="post-message-subheader"]')?.firstChild?.firstChild?.firstChild?.firstChild?.textContent?.trim() || ""; //updated
            const date = thread.querySelector('[data-tid="post-message-subheader"]')?.firstChild?.firstChild?.firstChild?.children[1]?.textContent?.trim() || ""; //updated
            const tId = thread.id;

            if (!isThreadInList(tId, megalist)) {
                const conversation = new Conversation(message, user, date, tId);

                const responseSummaryButton = [...thread.querySelectorAll('[data-tid="response-summary-button"]')]
                console.log("555555555", responseSummaryButton)
                if (responseSummaryButton && responseSummaryButton.length > 0) {
                    console.log("HITTTT")
                    responseSummaryButton[0].click();
                    setTimeout(() => {
                      
                      // const responseTImer = Date.now();
                      // while (Date.now() < responseTImer + 2000) {}
                      // console.log(document.querySelectorAll('[data-tid="reply-message-header"]'))
                      // let prevHeader = ""
                      // document.querySelectorAll('[data-tid="reply-message-header"]').forEach((comment)=>{
                      //     const replyMessage = comment.parentElement?.children[1].textContent?.trim();
                      //     let replyHeader = comment.parentElement.parentElement.parentElement.parentElement?.querySelector('[data-tid="reply-message-header"]');
                      //     if (prevHeader === "") {
                      //         prevHeader = replyHeader
                      //     }
                      //     if (["", "Edited"].includes(replyHeader?.firstChild.firstChild.firstChild.textContent.trim())) {
                      //         replyHeader = prevHeader;
                      //     } else {
                      //         prevHeader = replyHeader;
                      //     }
                      //     const replyUser = replyHeader?.firstChild.firstChild.firstChild.textContent.trim();
                      //     const replyDate = replyHeader?.firstChild.firstChild.children[1].textContent.trim();
                      //     conversation.reply(replyMessage, replyUser, replyDate);
                      // });
                          
                      // const followUpTImer = Date.now();
                      // setTimeout(() => {document.querySelector('[data-tid="close-l2-view-button"]').click();console.log('INNER OVER')}, 900)
                      // while (Date.now() < followUpTImer + 1000) {}
                      console.log('BEFORE')
                      // await wait(2000);
                      // const timer = Date.now();
                      // while(Date.now() < timer+2000) {};//console.log(Date.now(), timer+2000, Date.now() < timer+2000)}
                      console.log("INNER START")
                      let prevHeader = ""
                      document.querySelectorAll('[data-tid="reply-message-header"]').forEach((c)=> console.log(c.parentElement?.textContent?.trim()))
                      document.querySelectorAll('[data-tid="reply-message-header"]').forEach((comment)=>{
                          console.log(1)
                          const replyMessage = comment.parentElement?.children[1].textContent?.trim();
                          console.log(2)
                          let replyHeader = comment.parentElement.parentElement.parentElement.parentElement?.querySelector('[data-tid="reply-message-header"]');
                          if (prevHeader === "") {
                              prevHeader = replyHeader
                          }
                          console.log(3)
                          if (["", "Edited"].includes(replyHeader?.firstChild.firstChild.firstChild.textContent.trim())) {
                              replyHeader = prevHeader;
                          } else {
                              prevHeader = replyHeader;
                          }
                          console.log(4)
                          const replyUser = replyHeader?.firstChild.firstChild.firstChild.textContent.trim();
                          console.log(5)
                          console.log(replyHeader?.firstChild.firstChild.children[1].textContent)
                          const replyDate = replyHeader?.firstChild.firstChild.children[1].textContent.trim();
                          console.log(6)
                          conversation.reply(replyMessage, replyUser, replyDate);
                          megalist.conversations.push(conversation);

                          setTimeout(()=>{document.querySelector('[data-tid="close-l2-view-button"]').click();
                          console.log('INNER OVER');}, 1000);
                      })
                    }, 1000);
                    // const timer2 = Date.now();
                    // while(Date.now() < timer2+1000) {console.log(Date.now(), timer2+1000, Date.now() < timer2+1000)}
                    

                    // setTimeout(() => {                    
                    //     console.log("INNER START")
                    //     let prevHeader = ""
                    //     document.querySelectorAll('[data-tid="reply-message-header"]').forEach((comment)=>{
                    //         const replyMessage = comment.parentElement?.children[1].textContent?.trim();
                    //         let replyHeader = comment.parentElement.parentElement.parentElement.parentElement?.querySelector('[data-tid="reply-message-header"]');
                    //         if (prevHeader === "") {
                    //             prevHeader = replyHeader
                    //         }
                    //         if (["", "Edited"].includes(replyHeader?.firstChild.firstChild.firstChild.textContent.trim())) {
                    //             replyHeader = prevHeader;
                    //         } else {
                    //             prevHeader = replyHeader;
                    //         }
                    //         const replyUser = replyHeader?.firstChild.firstChild.firstChild.textContent.trim();
                    //         const replyDate = replyHeader?.firstChild.firstChild.children[1].textContent.trim();
                    //         conversation.reply(replyMessage, replyUser, replyDate);
                    //     });
                        
                    //     setTimeout(() => {document.querySelector('[data-tid="close-l2-view-button"]').click();console.log('INNER OVER');}, 1000);
                    // }, 2000);

                    console.log('AFTER')
                    // const curTime = Date.now();
                    // console.log("BEFORE WAIT")
                    // while (Date.now() < curTime + 2100) {}
                    // console.log("AFTER WAIT")

                }
                else {
                    let prevHeader = "";
                    thread.querySelector('[data-tid="response-surface"]')?.querySelectorAll('[data-tid="message-body"]').forEach((comment)=>{
                        const replyMessage = comment.textContent?.trim();
                        let replyHeader = comment.parentElement.parentElement.parentElement.parentElement?.querySelector('[data-tid="reply-message-header"]');
                        if (prevHeader === "") {
                            prevHeader = replyHeader
                        }
                        if (["", "Edited"].includes(replyHeader?.firstChild.firstChild.firstChild.textContent.trim())) {
                            replyHeader = prevHeader;
                        } else {
                            prevHeader = replyHeader;
                        }
                        const replyUser = replyHeader?.firstChild.firstChild.firstChild.textContent.trim();
                        const replyDate = replyHeader?.firstChild.firstChild.children[1].textContent.trim();
                        conversation.reply(replyMessage, replyUser, replyDate);
                    })
                    megalist.conversations.push(conversation);
                }
              }
            }
        }, 3000*index)
    );
    // console.log(`${i+1}/${ITERATION_COUNT}`)
    // console.log(megalist)
    if (i < ITERATION_COUNT - 1) {
      let failedScroll = false;
      try {
        document.querySelector('[data-tid="channel-pane-viewport"]').scrollBy(0,-1300);

      } catch (error) {
        failedScroll = true;
        setTimeout(()=>{
          document.querySelector('[data-tid="channel-pane-viewport"]').scrollBy(0,-1300);

        }, 1000);
      }

      if (failedScroll) {
        await wait(1000)
      }
      
      await wait(5000);

      let scrollIncrementor = 0
      
      let newThreads = [...document.querySelectorAll('[data-tid="channel-pane-message"]')].filter(thread => {
        if (checkedThreads.includes(thread.id)) {
          return false;
        }
        return true;
      });
      while (newThreads.length === 0) {
        document.querySelector('[data-tid="channel-pane-viewport"]').scrollBy(0,-1800 - (300 * scrollIncrementor));
        await wait(5000);
        newThreads = [...document.querySelectorAll('[data-tid="channel-pane-message"]')].filter(thread => {
          if (checkedThreads.includes(thread.id)) {
            return false;
          }
          return true;
        });
      }
        

      execute(i+1);
    } else {
      console.log("|------------------------|")
      console.log("|  All Channel Messages  |")
      console.log("|  CAN BE FOUND BELOW    |")
      console.log("|------------------------|")
      new JavascriptDataDownloader(sortMegalist(megalist), megalist.channelName).download();
    }
  }
  await execute(0);
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

runScript()
