// app/api/auth.ts
import { supabase } from "@/lib/supabase"

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

export const signOut = async () => {
  await supabase.auth.signOut()
}
