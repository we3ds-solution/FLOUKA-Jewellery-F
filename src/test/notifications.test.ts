import { beforeEach, describe, expect, it } from 'vitest';
import { canShowNotifications, useNotifications } from '@/stores/notifications';

describe('Signed-in notification access', () => {
  it('hides notifications from signed-out visitors', () => { expect(canShowNotifications(true, false)).toBe(false); });
  it('shows notifications after sign-in and hydration', () => { expect(canShowNotifications(true, true)).toBe(true); });
  it('does not show account notifications before hydration', () => { expect(canShowNotifications(false, true)).toBe(false); });
});
describe('Notification activity', () => {
  beforeEach(() => useNotifications.getState().clear());
  it('records account activity as unread', () => {
    useNotifications.getState().add('Account saved', undefined, 'success');
    expect(useNotifications.getState().items[0]?.read).toBe(false);
  });
  it('marks all stored activity as read', () => {
    useNotifications.getState().add('Saved', undefined, 'success');
    useNotifications.getState().readAll();
    expect(useNotifications.getState().items[0]?.read).toBe(true);
  });
  it('removes only the chosen notification', () => {
    useNotifications.getState().add('First', undefined, 'success');
    useNotifications.getState().add('Second', undefined, 'success');
    useNotifications.getState().remove(1);
    expect(useNotifications.getState().items.map(item => item.id)).toEqual([2]);
  });
});