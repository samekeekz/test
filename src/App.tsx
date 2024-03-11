import { useEffect, useState } from "react";
import { GetGroupsResponse, Group as GroupType, User } from "./types";
import { fetchGroups } from "./api";
import { ModalWindow } from "./components/ModalWindow";
import { useDisclosure } from "@mantine/hooks";

function App() {
  const [groups, setGroups] = useState<GroupType[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentUsers, setCurrentUsers] = useState<User[] | undefined>();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: GetGroupsResponse = await fetchGroups();
        console.log(response);
        if (response.result === 1) {
          setGroups(response.data);
        } else {
          console.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (users: User[] | undefined) => {
    open();
    setCurrentUsers(users);
  };

  return (
    <div className="grid justify-center pt-20">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group) => (
            <li key={group.id} className="border rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-4">
                <div
                  className="w-16 h-16 rounded-full mr-4"
                  style={{ backgroundColor: `${group.avatar_color}` }}
                ></div>
                <div>
                  <h2 className="text-lg font-semibold">{group.name}</h2>
                  <p className="text-sm">
                    {group.closed ? "Private" : "Public"}
                  </p>
                  <p className="text-sm">{group.members_count} members</p>
                  <p
                    className="text-sm cursor-pointer text-blue-500"
                    onClick={() => handleClick(group?.friends)}
                  >
                    {group?.friends
                      ? `${group?.friends?.length} ${
                          group?.friends?.length === 1 ? "friend" : "friends"
                        }`
                      : ""}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ModalWindow users={currentUsers} opened={opened} close={close} />
    </div>
  );
}

export default App;
