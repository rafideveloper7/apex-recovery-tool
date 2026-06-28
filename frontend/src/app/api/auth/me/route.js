export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ success: false, message: "No token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}