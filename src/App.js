import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            response: 0,
            endpoint: "http://127.0.0.1:4001",
            client: null
        };

        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        const {endpoint} = this.state;
        
        this.socket = socketIOClient(endpoint);
        
        this.socket.on("outgoing data", data => this.setState({response: data.num}));
        this.socket.on("chat message", data => {
            const el = document.getElementById('messages');
            const newMessageEl = document.createElement('li');
            newMessageEl.textContent = data;
            el.append(newMessageEl);
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.close();
    }

    sendMessage(e) {
        e.preventDefault();

        const el = document.getElementById('m');
        if (el.value) {
            this.socket.emit('chat message', el.value);
            el.value = "";
        }
    }

    render() {
        const {response} = this.state;
        return (
            <div style={{textAlign: "center"}}>
                {response}
                <ul id="messages"></ul>
                <div className="form" action="">
                    <input id="m" autoComplete="off" />
                    <button onClick={this.sendMessage}>Send</button>
                </div>
            </div>
        )
    }
}

export default App;