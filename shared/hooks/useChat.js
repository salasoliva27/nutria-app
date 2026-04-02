import { useState, useCallback, useEffect } from 'react'
import { streamChat } from '../lib/claude.js'

export function useChat({ persist = false, userId = null, patientProfile = null } = {}) {
  const [messages, setMessages] = useState([])
  const [isResponding, setIsResponding] = useState(false)
  const [conversationId, setConversationId] = useState(null)

  // Load persisted conversation on mount (app mode only)
  useEffect(() => {
    if (!persist || !userId) return
    loadConversation()
  }, [persist, userId])

  async function loadConversation() {
    try {
      const { supabase, supabaseConfigured } = await import('../lib/supabase.js')
      if (!supabaseConfigured) return
      const { data } = await supabase
        .from('nutria_conversations')
        .select('id, messages')
        .eq('user_id', userId)
        .single()

      if (data) {
        setMessages(data.messages || [])
        setConversationId(data.id)
      }
    } catch {
      // no existing conversation — start fresh
    }
  }

  async function saveConversation(updatedMessages) {
    if (!persist || !userId) return
    try {
      const { supabase, supabaseConfigured } = await import('../lib/supabase.js')
      if (!supabaseConfigured) return
      if (conversationId) {
        await supabase
          .from('nutria_conversations')
          .update({ messages: updatedMessages, updated_at: new Date().toISOString() })
          .eq('id', conversationId)
      } else {
        const { data } = await supabase
          .from('nutria_conversations')
          .insert({ user_id: userId, messages: updatedMessages })
          .select('id')
          .single()
        if (data) setConversationId(data.id)
      }
    } catch (err) {
      console.error('Failed to save conversation:', err)
    }
  }

  // Strip UI-only fields before sending to the API
  function toApiMessages(msgs) {
    return msgs.map(({ role, content }) => ({ role, content }))
  }

  const sendMessage = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsResponding(true)

    const assistantMessage = { role: 'assistant', content: '' }
    setMessages([...nextMessages, assistantMessage])

    try {
      await streamChat(
        toApiMessages(nextMessages),
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chunk,
            }
            return updated
          })
        },
        async (fullText) => {
          const finalMessages = [
            ...nextMessages,
            { role: 'assistant', content: fullText, isNew: true },
          ]
          setMessages(finalMessages)
          setIsResponding(false)
          await saveConversation(finalMessages)
        },
        patientProfile,
      )
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Lo siento, hubo un error. ¿Puedes intentar de nuevo?', isNew: true },
      ])
      setIsResponding(false)
    }
  }, [messages, patientProfile, persist, userId, conversationId])

  return { messages, isResponding, sendMessage }
}
