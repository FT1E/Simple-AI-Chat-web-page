// the input for the chat
// for now it's just a simple text area
// but might want to make it more complex
// like file uploads/attachments
// also maybe render the code/md as it's written

import { useState } from "react";

function ChatInput({ onSend, waitingForResponse }) {
    const [input, setInput] = useState("");

    const onInputChange = (e) => {
        setInput(e.target.value);
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // prevent newline typed for ctrl+enter
            onSend(input);
            setInput("");
        }
    }

    return(
        <div className="chat-input">
            <textarea
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="Type your message here..."
                disabled={waitingForResponse}
            />
            <button onClick={() => {
                onSend(input);
                setInput("");
            }} disabled={waitingForResponse}>
                Send
            </button>
        </div>
    )


}

export default ChatInput;