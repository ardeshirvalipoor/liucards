import services from "../../services"

export async function handleAuthCallback() {
  // 1) Get session/user
  const { data: { session }, error: sErr } = await services.supabase.auth.getSession()
  if (sErr || !session) {
    console.error(sErr)
    alert('No session after login')
    return
  }

  const { data, error } = await services.supabase.afterLoginMerge()
  if (error) {
    console.error(error)
    alert('Failed to attach your pre-login cards')
    // You can still continue; cards remain anonymous until claimed
  } else {
    // optional: show a toast with moved counts
    // data -> [{ moved_cards, ensured_saved }]
  }

  // 3) Reload user data for UI
  await refreshUserState()

  // 4) Navigate to home or reviews
  window.location.replace('/')
}

// your implementation: pull current user's saved_cards, etc.
async function refreshUserState() {
  // example: fetch due cards or user’s list
  // const { data } = await supabase.from('saved_cards').select('*').order('due_at', { ascending: true })
}
