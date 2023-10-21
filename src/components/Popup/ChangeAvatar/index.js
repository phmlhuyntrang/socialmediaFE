import React, { useState, useRef } from 'react';
import styles from './ChangeAvatar.module.scss';
import classNames from 'classnames/bind';
import Button from '../../Button';
import LoadImage from '../../LoadImage';
function PopupForm({ onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileButtonText, setFileButtonText] = useState('Chọn ảnh');
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        if (file) {
            setFileButtonText(file.name);
        } else {
            setFileButtonText('Chọn ảnh');
        }
    };

    console.log(fileInputRef.current);
    const cx = classNames.bind(styles);
    return (
        <div className={cx('popup-background')}>
            <div className={cx('popup-container')}>
                {/* <button className={cx('close')} onClick={onClose}>
                    x
                </button> */}
                <div className={cx('popup-top')}>
                    <h2>Thay đổi ảnh của bạn</h2>
                </div>
                {/* <div className={cx('popup-bottom')}>
                    <Button className={cx('picChosen')} onClick={handleButtonClick} red>
                        {fileButtonText}
                    </Button>
                    <input
                        ref={fileInputRef}
                        id="input-file"
                        title="Chọn ảnh"
                        type="file"
                        accept="image/png, image/gif, image/jpg, .png, .jpg, .jpeg"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div> */}
                <div className={cx('choose-image')}>
                    <LoadImage />
                </div>
                <div className={cx('optionBtn')}>
                    <Button onClick={() => onClose(selectedImage)} primary>
                        Hủy
                    </Button>
                    <Button className={cx('saveBtn')} onClick={() => onClose(selectedImage)} red>
                        Lưu
                    </Button>
                </div>

                {/* <button onClick={onClose}>Đóng</button> */}
            </div>
        </div>
    );
}

export default PopupForm;
