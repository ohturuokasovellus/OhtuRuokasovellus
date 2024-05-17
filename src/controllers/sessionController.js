const createSession = (userData) => {
    window.localStorage.setItem(
      'loggedUser', JSON.stringify(userData)
    )
}

const getSession = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  return loggedUserJSON
    ? JSON.parse(loggedUserJSON)
    : null
}

const deleteSession = () => {
  window.localStorage.removeItem('loggedUser')
}

export {
    createSession,
    getSession,
    deleteSession
}