import { gzip, ungzip } from 'pako'
import type { Data, Cycle, Symptom } from './types'

export type ShareSummary = {
  version: 1,
  generatedAt: string,
  name?: string,
  cycles: Cycle[],
  symptoms: Symptom[],
}

export function summarizeForShare(data: Data): ShareSummary {
  const since = new Date()
  since.setDate(since.getDate() - 90)
  const isoSince = since.toISOString().slice(0, 10)
  return {
    version: 1 as const,
    generatedAt: new Date().toISOString(),
    cycles: (data.cycles || []).filter(c => c.start_date >= isoSince),
    symptoms: (data.symptoms || []).filter(s => s.date >= isoSince),
  }
}

export function encodeShare(summary: ShareSummary): string {
  const json = JSON.stringify(summary)
  const bin = new TextEncoder().encode(json)
  const gz = gzip(bin)
  const b64 = base64UrlEncode(gz)
  return b64
}

export function decodeShare(payload: string): ShareSummary {
  const bin = base64UrlDecode(payload)
  const ungz = ungzip(bin)
  const json = new TextDecoder().decode(ungz)
  const obj = JSON.parse(json)
  return obj
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const b64 = btoa(binary)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (b64url.length % 4)) % 4)
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}
