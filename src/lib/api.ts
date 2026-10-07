export async function signUp(name: string, email: string, password: string) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Registration failed" };
    }

    return { success: true };
  } catch {
    return { error: "Network error. Please try again." };
  }
}