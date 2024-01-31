import Hashids from 'hashids'

const hashids = new Hashids()
function simpleHash(input: string) {
  return hashids.encode(input)
}

function getRoomHash(key: string, roomName: string) {
  return simpleHash(`${key}${roomName}`)
}

export function createRoomCode(roomName: string) {
  const key = (+new Date()).toString(36).slice(-5)
  const hash = getRoomHash(key, roomName)
  return key + hash
}

export function validateRoom(roomCode: string, roomName: string) {
  try {
    const key = roomCode.substring(0, 5)
    const hash = roomCode.substring(5)

    const computedHash = getRoomHash(key, roomName)

    if (hash !== computedHash)
      throw new Error('Bad room hash')
  }
  catch (e) {
    console.error(e)
    throw new Error('Invalid room code')
  }
}

export function randomRoomName(): string {
  return Math.random().toString(16).substring(2, 8)
}
