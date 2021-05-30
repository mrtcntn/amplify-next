import { Hub, HubCallback, HubPayload } from '@aws-amplify/core'
const busListeners = {}

/** Adds a listener to under the UNIQUE name, to the channel
 * If a listener with the name already exists, it will be removed
 * before this one is added
 * @param channel
 * @param name
 * @param callback
 */
export function registerListener(channel: string, name: string, callback: HubCallback): void {
  const previousListener = busListeners[name]
  if (previousListener) {
    Hub.remove(channel, previousListener)
  }
  busListeners[name] = callback
  Hub.listen(channel, busListeners[name])
}

/**
 * Removes a listener with the UNIQUE name, from the channel.
 * @param channel
 * @param name
 */
export function removeListener(channel: string, name: string): void {
  const listener = busListeners[name]
  if (listener) {
    Hub.remove(channel, listener)
  }
}

/**
 * Pushes a message out ot the listeners of the channel
 * @param channel
 * @param message
 */
export function pushMessage(channel: string, message: HubPayload): void {
  Hub.dispatch(channel, message)
}
