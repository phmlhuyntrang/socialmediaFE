import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MessageBox.module.scss';
import { faAngleLeft, faHeart, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import MessageCard from './MessageCard';
import { useState, useLayoutEffect, useContext, useEffect, useRef } from 'react';
import * as messageServices from '../../../../services/messageServices';
import { AccountLoginContext } from '../../../../context/AccountLoginContext';
import { StompContext } from '../../../../context/StompContext';
import { MessageContext } from '../../../../context/MessageContext';

const cx = classNames.bind(styles);

function MessageBox({ handleChange, chatWith }) {
    let stompClient = useContext(StompContext);
    let { userId } = useContext(AccountLoginContext);
    let { newMessage } = useContext(MessageContext);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [chatWith.messages]);

    // Get lastest message id
    let [lastestMessageId, setLastestMessageId] = useState(0);
    useLayoutEffect(() => {
        // sendMessage()
        const fetchLastestMessageID = async () => {
            const messages = await messageServices.getAllConversations();
            if(messages === null || messages === undefined) {
                setLastestMessageId(1);
            }
            else {
                setLastestMessageId(messages.at(-1).id + 1);
            }
        };
        fetchLastestMessageID();

        let stompObject = null;
        const loginToChat = () => {
            stompObject = stompClient.subscribe(
                `/app/login/${chatWith.conversation_id}`,
                (response) => {
                    // console.log(`Conversation ID: ${JSON.parse(response.body)}`);
                }
            );
        };
        loginToChat();

        return () => {
            stompClient.publish({
                destination: `/app/unsubscribe`, 
                body: chatWith.conversation_id.toString()
            });
            stompClient.unsubscribe(stompObject.id);
        };
    }, []);

    useEffect(() => {
        if(Object.keys(newMessage).length !== 0) { 
            chatWith.messages = [...chatWith.messages, newMessage];
            setCurrentMessage('');
            setIsEntering(false);
            setLastestMessageId((lastestMessageId) => lastestMessageId + 1);
        }
    }, [newMessage]);

    // Change chat icon
    const [isEntering, setIsEntering] = useState(false);
    const handleChatting = (e) => {
        if (e.target.value.length >= 1) {
            setIsEntering(true);
            setCurrentMessage(e.target.value);
        } else {
            setIsEntering(false);
            setCurrentMessage('');
        }
    };

    // Add new message
    const [currentMessage, setCurrentMessage] = useState('');
    const sendMessage = () => {
        stompClient.publish({
            destination: `/app/chat/conversation_id/${chatWith.conversation_id}`,
            body: JSON.stringify({
                id: lastestMessageId,
                user_id: userId,
                content: currentMessage,
                conversation_id: chatWith.conversation_id,
            }),
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            setIsEntering(false);
        }
    };

    return (
        <div className={cx('wrapper-message')}>
            <div className={cx('message-header')}>
                <div className={cx('wrapper-back-btn')} onClick={() => handleChange()}>
                    <button className={cx('back-btn')}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                </div>
                <h3 className={cx('sender-name')}>{chatWith.name}</h3>
            </div>

            <div className={cx('wrapper-message-list')}>
                <div className={cx('message-list')}>
                    {   
                        chatWith.messages.length !== 0 ?
                            chatWith.messages.map((message) => {
                                return <MessageCard key={message.id} message={message}></MessageCard>;
                            })
                        :
                            ''
                    }
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={cx('message-send-option')}>
                <input
                    className={cx('message-input')}
                    type="text"
                    placeholder="Send a message"
                    onKeyDown={(e) => {
                        handleKeyDown(e);
                    }}
                    onChange={(e) => handleChatting(e)}
                    value={currentMessage}
                ></input>
                <div
                    className={cx('wrapper-send_heart-btn')}
                    onClick={() => {
                        sendMessage();
                    }}
                >
                    <button className={cx('send_heart-btn')}>
                        {
                            isEntering ? 
                                <FontAwesomeIcon style={{ color: 'red' }} icon={faCircleArrowRight} />
                            : 
                                <FontAwesomeIcon icon={faHeart} />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessageBox;
