import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import React from 'react';
import ImgCrop from 'antd-img-crop';

const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image.jpg' ||
    file.type === 'image.gif';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  return isJpgOrPng && isLt2M;
};

const UploadPicture = (props) => {
  const { onChange, loading, imageUrl } = props;

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <ImgCrop aspect={16 / 10}>
      <Upload
        name="recipeThumbnail"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/upload-thumbnail"
        beforeUpload={beforeUpload}
        onChange={onChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};

export default UploadPicture;
