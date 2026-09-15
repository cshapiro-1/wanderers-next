import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/store/ui';

describe('Zustand UI Store', () => {
  beforeEach(() => {
    useStore.setState({
      activeDay: 1,
      editMode: false,
      docsPageOpen: false,
      hotelsOpen: false,
      flightOpen: false,
      restaurantsOpen: false,
      activitiesOpen: false,
      bookingOpen: false,
      phrasebookOpen: false,
      currencyOpen: false,
      takkyubinOpen: false,
      rainMode: false,
      jpyRate: 155,
      storyDay: null,
      selectedActivity: null,
      hoveredActivityKey: null,
      doneActivities: {},
    });
  });

  it('updates active day correctly across 1 to 18', () => {
    useStore.getState().setActiveDay(5);
    expect(useStore.getState().activeDay).toBe(5);

    useStore.getState().setActiveDay(18);
    expect(useStore.getState().activeDay).toBe(18);
  });

  it('toggles interactive modals', () => {
    useStore.getState().toggleCurrency();
    expect(useStore.getState().currencyOpen).toBe(true);
    useStore.getState().toggleCurrency();
    expect(useStore.getState().currencyOpen).toBe(false);

    useStore.getState().toggleTakkyubin();
    expect(useStore.getState().takkyubinOpen).toBe(true);
    useStore.getState().toggleTakkyubin();
    expect(useStore.getState().takkyubinOpen).toBe(false);

    useStore.getState().toggleRainMode();
    expect(useStore.getState().rainMode).toBe(true);
    useStore.getState().toggleRainMode();
    expect(useStore.getState().rainMode).toBe(false);
  });

  it('selects and deselects activity for 3D map focus', () => {
    useStore.getState().selectActivity('1_0', 35.5494, 139.7798);
    expect(useStore.getState().selectedActivity).toEqual({
      key: '1_0',
      lat: 35.5494,
      lng: 139.7798,
    });

    useStore.getState().selectActivity('1_0', 35.5494, 139.7798);
    expect(useStore.getState().selectedActivity).toBeNull();
  });

  it('toggles done status on activities', () => {
    useStore.getState().toggleDone('2_1');
    expect(useStore.getState().doneActivities['2_1']).toBe(true);

    useStore.getState().toggleDone('2_1');
    expect(useStore.getState().doneActivities['2_1']).toBe(false);
  });

  it('manages Story Mode playback state', () => {
    useStore.getState().openStory(3);
    expect(useStore.getState().storyDay).toBe(3);
    expect(useStore.getState().storyStep).toBe(0);

    useStore.getState().setStoryStep(2);
    expect(useStore.getState().storyStep).toBe(2);

    useStore.getState().closeStory();
    expect(useStore.getState().storyDay).toBeNull();
  });
});
