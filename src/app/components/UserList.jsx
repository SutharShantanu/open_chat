// components/UserList.jsx
import { Text, Card } from "@geist-ui/core";

export default function UserList ({ users }) {
    return (
        <div>
            <Text className="text-white mb-2" h4>Users in this Room:</Text>
            {users.map((user, index) => (
                <Card key={index} className="bg-gray-700 p-2 mb-2">
                    <Text className="text-white">{user.username}</Text>
                </Card>
            ))}
        </div>
    );
}
