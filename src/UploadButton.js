import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export const UploadButton = ({loading}) => {

  return (
    <button style={{border: 0, background: 'none'}} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8}}>
        Upload
      </div>
    </button>
  );
};