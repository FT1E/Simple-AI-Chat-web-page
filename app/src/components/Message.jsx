// single message in the chat

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ message, streaming, start }) {

    // todo - timestamp, model name / user name

    return (
        // todo - align left for LLM messages, right for user messages
        <div className={`message ${message.role}`}>
            <div >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default Message;