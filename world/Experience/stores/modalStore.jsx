import { create } from "zustand";
import { useWorldStore } from './worldStore';

export const useModalStore = create((set) => ({
  isModalOpen: false,
  modalTitle: "",
  modalContent: null,
  modalType: "",

  openModal: (title, content, type) => {
    useWorldStore.getState().discover(type);
    set({
      isModalOpen: true,
      modalTitle: title,
      modalContent: content,
      modalType: type,
    });
  },

  closeModal: () =>
    set({
      isModalOpen: false,
      modalTitle: "",
      modalContent: null,
      modalType: "",
    }),
}));
