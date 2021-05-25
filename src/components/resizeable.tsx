import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizeable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({direction, children}) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
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
      }, 100)
      
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, []);
  // we are assigning different props for the resizable box based on what direction it should be. 
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints:[innerWidth * 0.2, Infinity],
      maxConstraints:[innerWidth * 0.75, Infinity],
      height:Infinity,
      width: innerWidth * 0.75,
      resizeHandles: ['e'],
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