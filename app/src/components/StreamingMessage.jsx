import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState, useEffect } from 'react'


function StreamingMessage({ message, startIndex }) {
    const [visibleLength, setVisibleLength] = useState(startIndex);
    const text = message.content;

    useEffect(() => {
        const interval = setInterval(() => {
            if (visibleLength >= text.length) {
                clearInterval(interval);
                return;
            }
            setVisibleLength(length => Math.min(length + 1, text.length));
        }, 5);
        return () => clearInterval(interval);
    }, [text, startIndex, visibleLength]);

    return (
        <div className={`message ${message.role}`}>
            <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {text.slice(0, visibleLength)}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default StreamingMessage;