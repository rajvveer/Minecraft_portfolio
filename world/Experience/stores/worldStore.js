import { create } from 'zustand';
import { portfolio } from '../../../portfolio.config.js';

export const chapterAt = (progress) => progress < 0.17 || progress >= 0.85 ? 'meadow' : progress < 0.3 || progress >= 0.68 ? 'house' : progress < 0.49 ? 'gallery' : 'about';
export const dampProgress = (current, target, delta) => current + (target - current) * (1 - Math.exp(-6 * Math.max(0, Math.min(delta, 0.05))));

export const useWorldStore = create((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
  touring: false,
  photoMode: false,
  progress: 0,
  jump: { progress: 0, id: 0 },
  discovered: [],
  notice: null,
  setTouring: (touring) => set({ touring, photoMode: false }),
  setPhotoMode: (photoMode) => set({ photoMode, touring: false }),
  jumpTo: (progress) => set(state => ({
    jump: { progress: Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0)), id: state.jump.id + 1 },
    touring: false,
    photoMode: false,
  })),
  publishProgress: (progress) => set(state => {
    const rounded = Math.round(progress * 100);
    return rounded === state.progress ? state : { progress: rounded };
  }),
  discover: (id) => set(state => !Object.hasOwn(portfolio.projects, id) || state.discovered.includes(id) ? state : {
    discovered: [...state.discovered, id],
    notice: { id, title: state.discovered.length === 3 ? 'The whole collection!' : 'A new creation discovered', subtitle: state.discovered.length === 3 ? 'All four projects explored.' : portfolio.projects[id].title },
  }),
  dismissNotice: () => set({ notice: null }),
}));
