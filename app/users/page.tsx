export default async function UsersPage() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const res = await fetch("https://jsonplaceholder.typicode.com", {
    cache: "no-store", 
  });
  if (!res.ok) {
    throw new Error("Failed to load user data");
  }

  
  const users = await res.json();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User List</h1>
      <ul className="space-y-2">
        {users.map((user:Object) => (
          <li
            key={user.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
