import { MouseEventHandler } from "react";

// action button, it should accept a css className, and a onclick function. 
interface ActionButtonProps {
  className: string;
  onClick: MouseEventHandler;
}

const ActionButton: React.FC<ActionButtonProps> = ({className, onClick}) => {
  return (
    <button className="button is-primary is-small" onClick={onClick}>
          <span className="icon">
            <i className={className}></i>
          </span>
          
    </button>
  )
}

export default ActionButton;