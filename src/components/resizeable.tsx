import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizeable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({direction, children}) => {
  let resizableProps: ResizableBoxProps;

  if (direction === 'horizontal') {
    resizableProps = {
      minConstraints:[Infinity, 24],
      maxConstraints:[Infinity, window.innerHeight * 0.9],
      height:300,
      width:Infinity,
      resizeHandles: ['s'],
    };
  } else {
    resizableProps = {
      minConstraints:[Infinity, 24],
      maxConstraints:[Infinity, window.innerHeight * 0.9],
      height:300,
      width:Infinity,
      resizeHandles: ['s'],
    };
  }


  return (  
  <ResizableBox {...resizableProps}>
      {children}
  </ResizableBox>
  );
  
};

export default Resizable;