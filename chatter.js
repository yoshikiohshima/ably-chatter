import {key} from "./key.js";

class Chatter {
    constructor() {
        this.realtime = new Ably.Realtime(key);
        this.messages = [];
        this.channel = this.realtime.channels.get("pingpong");

        this.textIn = document.querySelector("#textIn");
        this.text = document.querySelector("#text");
        this.sendButton = document.querySelector("#sendButton");

        this.sendButton.addEventListener("click", () => this.send());

        this.channel.subscribe((msg) => {
            if (msg.name === "message") {
                this.receive(msg);
            }
        });

        this.channel.history((err, resultPage) => this.history(resultPage));
    }

    history(page) {
        for (let i = page.items.length - 1; i >= 0; i--) {
            this.receive(page.items[i]);
        }

        if (page.hasNext()) {
            page.next((err, nextPage) => {
                this.history(nextPage);
            });
        }
    }
        
    send() {
        let value = this.textIn.value;
        if (value.length === 0) {return;}
        
        this.channel.publish("message", {value});
        this.textIn.value = "";
    }

    receive(msg) {
        this.text.innerHTML += "<br>" + msg.data.value;
    }
}

function start() {
    let chatter = new Chatter();
}

window.onload = start;
