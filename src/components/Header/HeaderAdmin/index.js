import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './HeaderAdmin.module.scss';
import MenuSettingHeader from '../../Popup/MenuSettingHeader';
import Image from '../../Image';
import { MessageIcon, NotificationIcon, LogoPinterest } from '../../Icons';
import Popper from '../../Popper';
import NotificationPopper from '../../Popper/NotificationPopper';
import ConversationPopper from '../../Popper/ConversationPopper';
import config from '../../../config';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import { getUserById } from '../../../services/userServices';

const cx = classNames.bind(styles);
const label = { inputProps: { 'aria-label': 'Switch demo' } };

function HeaderAdmin({ className, account = false, handleOpenMenu }) {
    const userLogin = useContext(AccountLoginContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    // MENU KHI CHƯA ĐĂNG NHẬP
    const MENU_ITEMS = [
        {
            switchToggle: <Switch {...label} onChange={toggleTheme} />,
            title: 'Dark Mode',
        },
    ];
    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };

    // MENU SAU KHI ĐĂNG NHẬP
    const userMenu = [
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];
    const [user, setUser] = useState({});
    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        if (userLogin !== 0) {
            getUserById(userLogin)
                .then((response) => {
                    setUser(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // setLoading(false);
    }, [userLogin]);
    return (
        <header className={cx(className, 'wrapper', theme === 'dark' ? 'dark' : '')}>
            <div className={cx('inner', { account: account })}>
                {/* LEFT MENU */}
                {account ? (
                    <div className={cx('container-title')}>
                        <Link to={config.routes.admin} className={cx('logo-link')}>
                            <LogoPinterest className={cx('icon')} />
                            <h1 className={cx('name')}>DATH</h1>
                        </Link>
                    </div>
                ) : (
                    <button className={cx('menu')} onClick={handleOpenMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                )}

                {/* ACTIONS */}
                <div className={cx('actions')}>
                    <Popper
                        title={<NotificationIcon className={cx('action', theme === 'dark' ? 'dark' : '')} />}
                        body={<NotificationPopper />}
                        widthBody="maxContent"
                    />
                    <Popper
                        title={<MessageIcon className={cx('action', theme === 'dark' ? 'dark' : '')} />}
                        body={<ConversationPopper />}
                        left="-48px"
                        widthBody="maxContent"
                    />

                    <Link className={cx('link-avatar')} to={`/admin/${user.username}/edit-profile`}>
                        <Image
                            src={user.avatar && `data:image/jpeg;base64,${user.avatar}`}
                            className={cx('action', 'user-avatar')}
                            alt={user.username}
                        />
                    </Link>

                    <MenuSettingHeader className={cx('action')} items={userMenu} onChange={handleMenuChange}>
                        <button className={cx('more-btn', theme === 'dark' ? 'dark' : '')}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </MenuSettingHeader>
                </div>
            </div>
        </header>
    );
}
export default HeaderAdmin;
