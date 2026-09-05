import { useEffect, useRef } from 'react';
import './Modal.scss';
import { useModalStore } from '../../Experience/stores/modalStore';
import { playSound } from '../../utils/audioSystem';

export default function Modal() {
  const { isModalOpen, modalTitle, modalContent, closeModal } = useModalStore();
  const dialog = useRef(null);
  const body = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    if (isModalOpen && !element.open) element.showModal();
    if (!isModalOpen && element.open) element.close();
  }, [isModalOpen]);
  useEffect(() => { body.current?.scrollTo(0, 0); }, [modalTitle]);

  return <dialog ref={dialog} aria-labelledby="modal-title" className={`modal ${isModalOpen ? 'modal-enter' : ''}`}
    onCancel={event => { event.preventDefault(); closeModal(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
    }}>
    <div className="modal-header"><div className="modal-header-wrapper">
      <h1 id="modal-title" className="modal-title">{modalTitle}</h1>
      <button aria-label="Close panel" className="modal-close-button" onClick={() => { playSound('buttonClick'); closeModal(); }}>×</button>
    </div></div>
    <div ref={body} className="modal-body">{modalContent}</div>
  </dialog>;
}
