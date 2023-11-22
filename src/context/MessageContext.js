import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ConversationContext } from './ConversationContext';
import { StompContext } from './StompContext';
import * as participantsService from '../services/participantServices';
import { AccountLoginContext } from './AccountLoginContext';
const MessageContext = createContext({});

function MessageProvider({ children }) {
    const stompClient = useContext(StompContext);
    const USER_ID = useContext(AccountLoginContext);
    let conversations = useContext(ConversationContext);
    let conversationJoined = [];
    const [messageCount, setMessageCount] = useState(0);
    const [newMessage, setNewMessage] = useState();
    useEffect(() => {
        const fetchAPI = async () => {
            var temp = await participantsService.getConversationJoinedByUserId(USER_ID);
            temp.forEach(element => {
                conversationJoined = [...conversationJoined, element.conversation.id];
            });
            loadRoom();
        }
        const loadRoom = async () => {
            setTimeout(() => {
                conversationJoined.forEach((conversation_id) => {
                    stompClient.subscribe(
                        `/room/conversation_id/${conversation_id}`,
                        function (message) {
                            updateMessages(JSON.parse(message.body));
                        },
                    );
                });
                stompClient.subscribe(
                    '/room/testUnsubscribe',
                    (response) => {
                        console.log(response.body)
                    }
                );
                countMessage();
            }, 1500);
        };
        if(USER_ID !== 0) {
            fetchAPI();
        }
    }, [USER_ID]);

    const countMessage = () => {
        let count = 0;
        conversations.current.forEach((item) => {
            item.messages.forEach((message) => {
                if(!message.seen && message.user.id !== USER_ID) {
                    count ++;
                }
            });
        });
        setMessageCount(count);
    };

    const updateMessages = (message) => {
        conversations.current.forEach((item) => {
            if(item.conversation.id === message.conversation.id) {
                item.messages = [...item.messages, message];
                item.lastMessage = message.content;
            }
        });
        if(!message.seen && message.user.id !== USER_ID) {
            setMessageCount(count => count+1);
        }
        setNewMessage(message);
    }

    const setSeenAllMessage = () => {
        conversations.current.forEach((item) => {
        });
        setMessageCount(0);
    }

    useEffect(() => {
        console.log(`New Message: ${messageCount}`);
    },[messageCount]);

    return <MessageContext.Provider value={{messageCount: messageCount, newMessage: newMessage}}>{children}</MessageContext.Provider>;
}

export { MessageProvider, MessageContext };
