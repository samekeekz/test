import { useEffect, useState } from "react";
import { GetGroupsResponse, Group, User } from "./types";
import { fetchGroups } from "./api";

function App() {
  const [groups, setGroups] = useState<Group[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentUsers, setCurrentUsers] = useState<User[] | undefined>();

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
    setCurrentUsers(users);
  };
  return (
    <div className="grid justify-center pt-20">
      <h1>Groups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {groups?.map((group) => (
            <li key={group.id}>
              <div className="flex gap-2 items-center">
                <div
                  className={`w-[100px] h-[100px] rounded-full`}
                  style={{ backgroundColor: `${group.avatar_color}` }}
                ></div>
                <div>
                  <strong>{group.name}</strong>
                  <p>{group.closed ? "private" : "public"}</p>
                  <p>{group.members_count} members</p>
                  <p
                    className="cursor-pointer"
                    onClick={() => handleClick(group?.friends)}
                  >
                    {group?.friends
                      ? `${
                          group?.friends?.length === 1
                            ? `${group?.friends?.length} friend`
                            : `${group?.friends?.length} friends`
                        }`
                      : ""}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* <ModalWindow users={currentUsers} /> */}
    </div>
  );
}

export default App;
