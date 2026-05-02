console.log("JS is working")
import { supabase } from './supabase.js'

async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  displayUsers(data)
}

function displayUsers(data) {
  const container = document.getElementById("data")

  data.forEach(user => {
    container.innerHTML += `<p>${user.name} - ${user.email}</p>`
  })
}

getUsers()