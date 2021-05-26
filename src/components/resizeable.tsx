import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizeable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}
// All that this class does is add a resizeable bar, two in fact to the code editor so that it can be made bigger, or the preview window bigger. Actually pretty complicated 
const Resizable: React.FC<ResizableProps> = ({direction, children}) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  // use effect timer so that when we're updating state (the browser window being resized it doesn't always update the set, it waits 100ms for better performance)
  useEffect (() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100)
      
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, [width]);
  
  // we are assigning different props for the resizable box based on what direction it should be. 
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints:[innerWidth * 0.2, Infinity],
      maxConstraints:[innerWidth * 0.75, Infinity],
      height:Infinity,
      width,
      resizeHandles: ['e'],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      }
    };
  } else {
    resizableProps = {
      minConstraints:[Infinity, 24],
      maxConstraints:[Infinity, innerHeight * 0.9],
      height:300,
      width:Infinity,
      resizeHandles: ['s'],
    };
  }

  // returning th resizable box with the props from above, giving the 'direction prop made at item creation
  return (  
  <ResizableBox {...resizableProps}>
      {children}
  </ResizableBox>
  );
  
};

export default Resizable;