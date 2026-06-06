import React from 'react';

export function withPreventDefault(fn: () => Promise<void> | void) {
  return function (e: React.FormEvent) {
    e.preventDefault();
    fn();
  };
}
