import { Ready } from '../types/callbacks';

export default function ready(fn: Ready): void {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}