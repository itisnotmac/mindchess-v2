import { useEffect } from 'react';

const ROOM_CLASSES = [
  'room-throne', 'room-game-hall', 'room-library', 'room-war-room',
  'room-hall-of-records', 'room-castle-gate', 'room-dungeon',
  'room-observatory', 'room-forge', 'room-privacy', 'room-terms',
];

/**
 * Sets a castle room background on <body> for the duration of a page's mount.
 * Usage: useRoomBackground('room-throne')
 */
export function useRoomBackground(roomClass) {
  useEffect(() => {
    ROOM_CLASSES.forEach(c => document.body.classList.remove(c));
    if (roomClass) document.body.classList.add(roomClass);
    return () => document.body.classList.remove(roomClass);
  }, [roomClass]);
}
