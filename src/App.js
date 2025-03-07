import { useEffect, useState } from 'react';
import { Button, ColorPicker, Flex, Image as ImageComponent, Radio, Upload } from 'antd';
import { CopyableText } from './CopyableText';
import { UploadButton } from './UploadButton';
import { IMAGE_FALLBACK } from './constants';
import './App.css';

function App() {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const [color, setColor] = useState('rgba(22, 119, 255, 0.5)');
  const [points, setPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);

  const [format, setFormat] = useState('JSON');
  const [json, setJson] = useState('');
  const [jsx, setJsx] = useState('');


  const onUploadChange = (info) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setImageUrl(img.src);
        setLoading(false);
      };
    };

    reader.readAsDataURL(info.file.originFileObj);
  };


  const addPoint = (e) => {
    const rect = e.target.getBoundingClientRect();
    // coordinates relative to div
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints([...points, {x: x, y: y}]);
  };


  const generatePolygon = () => {
    const xArray = points.map(point => point.x);
    const yArray = points.map(point => point.y);

    const xMin = Math.min(...xArray), xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray), yMax = Math.max(...yArray);

    const divWidth = xMax - xMin;
    const divHeight = yMax - yMin;
   
    const polygonLeft = ((xMin / width) * 100).toFixed(2);
    const polygonRight = ((yMin / height) * 100).toFixed(2);
    const polygonWidth = ((divWidth / width) * 100).toFixed(2);
    const polygonHeight = ((divHeight / height) * 100).toFixed(2);

    const positions = points.map(point => {
      const x = ((point.x - xMin) / divWidth * 100).toFixed(2);
      const y = ((point.y - yMin) / divHeight * 100).toFixed(2);
      return `${x}% ${y}%`;
    });

    setPolygons([...polygons, {
      left: `${polygonLeft}%`,
      top: `${polygonRight}%`,
      width: `${polygonWidth}%`,
      height:`${polygonHeight}%`,
      clipPath: `polygon(${positions.join(', ')})`
    }]);

    setPoints([]);
  };

  
  const onColorPickerChange = (value) => {
    const metaColor = value.metaColor;
    setColor(`rgba(${metaColor.r}, ${metaColor.g}, ${metaColor.b}, ${metaColor.a})`);
  };

  
  useEffect(() => {
    const jsonText = JSON.stringify(polygons, null, '\t');
    setJson(jsonText);
    
    const jsxText = polygons.map((polygon, index) => `<div style={{position: 'absolute', width: '${polygon.width}', height: '${polygon.height}', top: '${polygon.top}', left: '${polygon.left}'}}>\n\t<div style={{width: '100%', height: '100%', backgroundColor: '${color}', clipPath: '${polygon.clipPath}'}}>\n\t</div>\n</div>\n`).join('');
    setJsx(jsxText);

  }, [polygons, color]);


  return (
    <div className="App">
      Upload an image and click on it to create polygons
      {imageUrl ? (
        <div style={{position: 'relative', width: width, height: height}} onClick={addPoint}>
          <ImageComponent
            width={width}
            height={height}
            src={imageUrl}
            fallback={IMAGE_FALLBACK}
            preview={false}
          />
          {points.map((point, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: point.x,
                top: point.y,
                backgroundColor: color,
                borderRadius: "50%",
                width: "5px",
                height: "5px" 
              }}
            >
            </div>
          ))}
          {polygons.map((polygon, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: polygon.width,
                height: polygon.height,
                top: polygon.top,
                left: polygon.left
              }}>
              <div style={{width: "100%", height: "100%", backgroundColor: color, clipPath: polygon.clipPath}}></div>
            </div>
          ))}
        </div>) : (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          onChange={onUploadChange}
        >
          <UploadButton loading={loading} />
        </Upload>
      )}
      <Flex align="center" gap="small">
        <Button onClick={generatePolygon}>Generate Polygon</Button>
        <ColorPicker defaultValue={color} onChange={onColorPickerChange} />
      </Flex>
      {polygons.length > 0 && <>
        <CopyableText text={format === 'JSON' ? json : jsx} />
        <Radio.Group
          name='radiogroup'
          defaultValue={'JSON'}
          options={[
            { value: 'JSON', label: 'JSON' },
            { value: 'JSX', label: 'JSX' }
          ]}
          onChange={(e) => setFormat(e.target.value)}
        />
      </>}
    </div>
  );
}

export default App;
