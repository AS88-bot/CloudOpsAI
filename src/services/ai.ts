
export async function analyzeInfrastructure(type: string, content: string) {
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content }),
  });
  return response.json();
}

export async function auditSecurity(content: string) {
  const response = await fetch('/api/ai/security-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function optimizeCost(content: string) {
  const response = await fetch('/api/ai/cost-optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function analyzeLogs(content: string) {
  const response = await fetch('/api/ai/analyze-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function generateDocs(content: string) {
  const response = await fetch('/api/ai/generate-docs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function interviewCoach(topic: string) {
  const response = await fetch('/api/ai/interview-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  return response.json();
}

export async function generateArchitecture(prompt: string) {
  const response = await fetch('/api/ai/generate-architecture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}
