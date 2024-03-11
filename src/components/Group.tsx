import { Group as GroupType } from "../types/";

const Group = ({ group: GroupType }) => {
  return (
    <li key={group.id} className="border rounded-lg p-4 shadow-md bg-slate-200">
      <div className="flex items-center">
        {renderAvatar(group.avatar_color)}
        <div>
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm">{group.closed ? "Private" : "Public"}</p>
          {renderMembersCount(group.members_count)}
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
  );
};

export default Group;
