const createSession = (userData) => {
    window.localStorage.setItem(
      'loggedRuokasovellusUser', JSON.stringify(userData)
    )
}

const getSession = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedRuokasovellusUser')
  return loggedUserJSON
    ? JSON.parse(loggedUserJSON)
    : null
}

const deleteSession = () => {
  window.localStorage.removeItem('loggedRuokasovellusUser')
}

export {
    createSession,
    getSession,
    deleteSession
}