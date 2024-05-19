import { Alert } from "react-bootstrap";
type Props = {
  variant?: string;
  children: React.ReactNode;
};

const Message: React.FC<Props> = ({ variant = "info", children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
