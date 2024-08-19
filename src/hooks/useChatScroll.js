import { useEffect, useRef } from 'react';

const useChatScroll = (dependency) => {
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [dependency]);

    return chatBoxRef;
};

export default useChatScroll;
