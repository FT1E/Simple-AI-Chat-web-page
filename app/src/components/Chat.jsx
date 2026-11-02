// the main component for the chat interface

import "./chat.css"

import ChatInput from "./ChatInput.jsx";
import Message from "./Message.jsx";

import puter from "@heyputer/puter.js"
import { useState } from "react";

function Chat({}) {


    const [messages, setMessages] = useState([]);
    const [ai_options, setAiOptions] = useState({stream: true, model: "gpt-4o-mini", temperature: 0.7});
    const [waitingForResponse, setWaitingForResponse] = useState(false);

    const UNDEFINED_LEN = "undefined".length;

    const onSend = async (message) => {
        // todo - docs

        // - check message, trim spaces
        message = message.trim();
        if (!message) return;

        const history = [...messages, { role: "user", content: message }];

        // * - add user message to history
        setMessages((prevMessages) => [...prevMessages, { role: "user", content: message }, { role: "assistant", content: "" }]);

        // * - send message to puter and get response
        setWaitingForResponse(true);
        try{
            const stream = await puter.ai.chat(history, ai_options);

            let last_msg = "";
            let startIndex = 0;
            let i=0
            for await (const part of stream) {
                last_msg += part?.text;
                startIndex += part?.text?.length || 0;

                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = { role : "assistant", content: last_msg };
                    return newMessages;
                });

                i+=1;
                // console.log(`received part ${i}`)
            }

            last_msg = last_msg.slice(0, last_msg.length - UNDEFINED_LEN);
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = { role : "assistant", content: last_msg };
                return newMessages;
            });

            // console.log("stream finished, final message:\n", last_msg);
            
            
        } catch (error) {
            // todo - UI response for error
            console.error("Error sending message:", error);
        } finally{
            setWaitingForResponse(false);
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    message.startIndex !== undefined ?
                    <StreamingMessage key={index} message={message} startIndex={message.startIndex} /> :
                    <Message key={index} message={message} />
                ))}
                {waitingForResponse && messages[messages.length - 1]?.role !== "ai" && (
                    <div className="message ai chat-loading" role="status" aria-label="AI is thinking">
                        <div className="message-content">
                            <span className="loading-dots" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <ChatInput onSend={onSend} waitingForResponse={waitingForResponse} />
        </div>
    )

}

export default Chat;