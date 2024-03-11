import { Modal } from "@mantine/core";
import { User } from "../types/index";
import "../index.css";

type Props = {
  users: User[] | undefined;
  opened: boolean;
  close: () => void;
};

export const ModalWindow = ({ users, opened, close }: Props) => {
  return (
    <Modal
      styles={{
        title: { fontSize: "1.5rem", fontWeight: "bold" },
        content: { borderRadius: "10px" },
      }}
      size="xs"
      opened={opened}
      onClose={close}
      title="Friends"
      centered
    >
      {users?.map((user) => (
        <div key={user.first_name + user.last_name} className="mb-2">
          <p>
            {user.first_name} {user.last_name}
          </p>
        </div>
      ))}
    </Modal>
  );
};
