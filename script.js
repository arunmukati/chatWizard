let baseURL = 'https://chat-bot-backend-arun.herokuapp.com/'
let chatWrap = document.getElementById('chat-wrap');
let sendText = document.getElementById("sendText");
let chatBody = document.getElementById('chatBody');
let ioScript = document.getElementById('ioscript');
// let wraper = document.getElementById('wrapper');
// ioScript.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js";
// wraper.prepend(ioScript);
let userId = '5ff8392940b8e10cb497f44e';
let socket;
let page = 1;
let userChatId;
function setUserChatId() {
    userChatId = objectId();
    localStorage.setItem('userChatId', userChatId.toString())
    // document.cookie= `userId=${userId.toString()}; expires=Thu, 18 Dec 2023 12:00:00 UTC;path=/`;
    // console.log(document.cookie)
    return;
}
window.onload = (() => {
    let user = localStorage.getItem('userChatId');
    console.log("sdbsjbdc", user);
    if (user) {
        userChatId = user;
        loadOldChats();
    } else {
        userChatId = false;
    }
})();
ioScript.onload = (() => {
    socket = io(baseURL, {
        transports: ["websocket"]
    });
    socket.on('connect', function (data) {
        // console.log(data)
        socket.emit('joinchannel', `user-${userChatId}`);
        // data.join(`socket-${userId}`);
        // alert('loaded');
        // socket.emit('message', 'from frontend');
        socket.on("message", (msg) => {
            console.log("message",msg);
            textRecieved(msg.text)
        })
    });


})();
document.getElementById('chat-btn').addEventListener('click', () => {
    console.log(document.getElementById('chatBody').scrollHeight)
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
    chatWrap.toggleAttribute('show');
    chatWrap.toggleAttribute('hidden');
    if (!userChatId) {
        // alert("hh")
    }
    sendText.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            sendMessage();
        }
    })
    // chatWrap.innerHTML = chatWrapContent;
    // postData('initial');
    // chatWrap.setAttribute('show', true);

});
function sendMessage() {
    if (!userChatId) {
        setUserChatId();
    }
    if (sendText.value == '')
        return;
    textEntered(sendText.value)
    socket.emit('message', { text: sendText.value, userId: userId, timestamp: new Date().getTime(), userChatId: userChatId });
    sendText.value = '';
}
function textEntered(text) {
    console.log("textEnterds",text);
    let div = document.createElement('div');
    div.setAttribute('class', 'o-message');
    div.innerHTML = `<p> ${text} </p> `;

    // this.postData(sendText.value);

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
function textRecieved(txt) {
    console.log("textReciebde",txt)
    let div = document.createElement('div');
    div.setAttribute('class', 'i-message');
    div.innerHTML = `   <img src="bot.png" alt=""><p> ${txt} </p> `;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
function loadOldChats() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", baseURL + 'api/messages/' + userChatId);

    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        console.log("redausarte", xhr.status);
        if (xhr.readyState == 4 && xhr.status == 200) {
            const json = JSON.parse(xhr.responseText);
            if(json.data){
                showOldChats(json.data['chats']);
            }
        }
    };
    xhr.send();
}

async function postData(txt) {
    socket.emit('message', txt)
    //   let xhr = new XMLHttpRequest();
    //   xhr.open("POST", baseURL + "/webhooks/rest/webhook");

    //     xhr.setRequestHeader("Content-type", "application/json");
    //     xhr.onreadystatechange = function () {
    //         console.log("redausarte", xhr.status);
    //       if (xhr.readyState == 4 && xhr.status == 200) {
    //           console.log(xhr.responseText);
    //           const json = JSON.parse(xhr.responseText);
    //           console.log("json", json[0]);
    //           textRecieved(json[0].text);
    //         //   textRecieved()
    //       }
    //   };
    //   xhr.send(
    //    JSON.stringify({
    //        "sender": "Rasa333",
    //        "message": txt
    //    })
    //   );
}
function showOldChats(chats) {
    console.log(chats)
    chats.forEach(ele => {
        if(ele.fromUser){
            textEntered(ele.text)
        }else{
            textRecieved(ele.text)
        }
    });


}
function objectId() {
    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

function hex(value) {
    return Math.floor(value).toString(16)
}
let chatWrapContent = " <div class='head'></div >    <div class='body' id='chatBody'>        <!-- <div class='i-message'>            <img src='bot.png' alt='>                <p> Hello! This is IMBot. How can i help you.</p>    </div>            <div class='o-message'>                <p>Hello</p>            </div>            <div class='o-message'>                <p> Who are You?</p>            </div>            <div class='i-message'>                <img src='bot.png' alt='>                    <p><img src='typing.gif' alt='></p>       </div> --></div>                <div class='footer'>                    <div class='text-div'>                        <input type='text' placeholder='Type Here...' name=' id='sendText' >                            <div class='send' onclick='sendMessage()'>                                <img src='send-button.svg' alt=' srcset='>        </div>                            </div></div>"
