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
  const [filters, setFilters] = useState({
    accountType: "",
    avatarColor: "",
    hasFriends: false,
  });

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

  const applyFilters = (group: GroupType): boolean => {
    const { accountType, avatarColor, hasFriends } = filters;
    if (
      (accountType === "public" && group.closed) ||
      (accountType === "private" && !group.closed) ||
      (avatarColor && group.avatar_color !== avatarColor) ||
      (hasFriends && (!group.friends || group.friends.length === 0))
    ) {
      return false;
    }
    return true;
  };

  const filteredGroups = groups?.filter((group) => applyFilters(group));

  return (
    <div className="grid justify-center pt-20 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Groups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-around mb-6">
            <div>
              <label htmlFor="accountType">Account type</label>
              <select
                id="accountType"
                value={filters.accountType}
                onChange={(e) =>
                  setFilters({ ...filters, accountType: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label htmlFor="avatarColor">Avatar color</label>
              <select
                id="avatarColor"
                value={filters.avatarColor}
                onChange={(e) =>
                  setFilters({ ...filters, avatarColor: e.target.value })
                }
              >
                <option value="">All</option>
                {groups
                  ?.map((group) => group.avatar_color)
                  .filter(
                    (color, index, self) =>
                      self.indexOf(color) === index && color !== undefined
                  )
                  .map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="hasFriends">Has friends</label>
              <input
                type="checkbox"
                id="hasFriends"
                checked={filters.hasFriends}
                onChange={(e) =>
                  setFilters({ ...filters, hasFriends: e.target.checked })
                }
              />
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups?.map((group) => (
              <li
                key={group.id}
                className="border rounded-lg p-4 shadow-md bg-slate-200"
              >
                <div className="flex items-center">
                  {group.avatar_color && (
                    <div
                      className="w-16 h-16 rounded-full mr-4"
                      style={{ backgroundColor: `${group.avatar_color}` }}
                    ></div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{group.name}</h2>
                    <p className="text-sm">
                      {group.closed ? "Private" : "Public"}
                    </p>
                    <p className="text-sm">
                      {group.members_count > 0
                        ? `${group.members_count} members`
                        : ""}
                    </p>
                    <p
                      className="text-sm cursor-pointer text-blue-500 mt-1"
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
        </>
      )}
      <ModalWindow users={currentUsers} opened={opened} close={close} />
    </div>
  );
}

export default App;
