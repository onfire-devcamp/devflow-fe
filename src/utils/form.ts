import React from 'react';
/**
 * HOF prevent reload
 */
export const withPreventDefault = (fn: () => void) => (e: React.FormEvent) => {
  e.preventDefault();
  fn();
};
