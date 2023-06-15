import ReactModal from 'react-modal';
import { ClipLoader } from "react-spinners";

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => (
  <ReactModal
    isOpen={isLoading}
    contentLabel="Loading Modal"
    style={{
      overlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      content: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
      },
    }}
  >
    <ClipLoader color="#123abc" loading={isLoading} size={150} />
  </ReactModal>
);

export default LoadingModal;