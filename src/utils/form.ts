import React from 'react';

/**
 * HOF prevent reload
 */
export function withPreventDefault(fn: () => void) {
  return function (e: React.FormEvent) {
    e.preventDefault();
    fn();
  };
}
