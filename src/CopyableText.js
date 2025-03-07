import { Typography } from 'antd';

const { Text, Paragraph, Link } = Typography;

export const CopyableText = ({text}) => {
  return (
    <Paragraph
      style={{
        fontFamily: 'monospace',
        background: 'rgba(150, 150, 150, 0.1)',
        border: '1px solid rgba(100, 100, 100, 0.2)',
        borderRadius: '3px',
        padding: '8px',
        whiteSpace: 'pre-wrap',
        width: 800,
        maxHeight: 600,
        overflow: 'scroll'
      }}
    >
      <Text style={{display: 'block', float: 'right'}} copyable={{ text: text }} />
      {text}
    </Paragraph>
  );
};